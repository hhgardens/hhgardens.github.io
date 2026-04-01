#!/usr/bin/env python3
"""
AI image upscaler using Google Gemini + optional compression.

Usage:
    python3 enhance.py <input> [options]
    python3 enhance.py photo.jpg                    # Upscale and compress in-place
    python3 enhance.py photo.jpg -o enhanced.jpg    # Upscale to new file
    python3 enhance.py images/                      # Batch upscale directory in-place
"""

import argparse
import base64
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

MODEL = "gemini-3.1-flash-image-preview"
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

PROMPTS = [
    "Upscale this photo to a higher resolution. Preserve exact details, colors, and composition.",
    "Enhance the resolution of this image. Keep all original content, colors, and layout exactly the same.",
    "Make this image higher resolution while keeping it identical to the original.",
]

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"}


def find_env_file(start: Path, name: str) -> Path | None:
    """Walk up from start looking for an env file."""
    current = start.resolve()
    for _ in range(20):
        candidate = current / name
        if candidate.is_file():
            return candidate
        parent = current.parent
        if parent == current:
            break
        current = parent
    return None


def load_api_key(env_file: str | None = None) -> str:
    """Load GEMINI_API_KEY from environment or .env/.dev.vars files."""
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key

    search_files = []
    if env_file:
        search_files.append(Path(env_file))
    search_files += [".dev.vars", ".env"]

    for name in search_files:
        path = Path(name) if isinstance(name, Path) and name.is_absolute() else find_env_file(Path.cwd(), str(name))
        if path and path.is_file():
            for line in path.read_text().splitlines():
                line = line.strip()
                if line.startswith("#") or "=" not in line:
                    continue
                k, _, v = line.partition("=")
                k, v = k.strip(), v.strip().strip("\"'")
                if k == "GEMINI_API_KEY" and v:
                    return v

    print("Error: GEMINI_API_KEY not found.", file=sys.stderr)
    print("Set it in .env, .dev.vars, or export GEMINI_API_KEY=...", file=sys.stderr)
    sys.exit(1)


def get_mime_type(path: Path) -> str:
    """Detect MIME type via `file` command, fallback to extension mapping."""
    try:
        result = subprocess.run(["file", "--mime-type", "-b", str(path)], capture_output=True, text=True)
        mime = result.stdout.strip()
        if mime.startswith("image/"):
            return mime
    except FileNotFoundError:
        pass
    ext_map = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
               ".webp": "image/webp", ".gif": "image/gif", ".bmp": "image/bmp"}
    return ext_map.get(path.suffix.lower(), "image/jpeg")


def get_dimensions(path: Path) -> str:
    """Get image dimensions via ImageMagick identify."""
    try:
        result = subprocess.run(["identify", "-format", "%wx%h", str(path)], capture_output=True, text=True)
        return result.stdout.strip() if result.returncode == 0 else "unknown"
    except FileNotFoundError:
        return "unknown"


def upscale(input_path: Path, output_path: Path, api_key: str) -> bool:
    """Upscale a single image via Gemini API. Returns True on success."""
    mime_type = get_mime_type(input_path)
    image_data = base64.b64encode(input_path.read_bytes()).decode("ascii")
    in_dims = get_dimensions(input_path)

    for attempt, prompt in enumerate(PROMPTS):
        request = {
            "contents": [{
                "role": "user",
                "parts": [
                    {"inlineData": {"mimeType": mime_type, "data": image_data}},
                    {"text": prompt},
                ],
            }],
            "generationConfig": {
                "responseModalities": ["IMAGE", "TEXT"],
                "thinkingConfig": {"thinkingLevel": "MINIMAL"},
                "imageConfig": {"imageSize": "1K"},
            },
        }

        # Write request/response to temp files next to the input (avoids /tmp)
        tmp_dir = input_path.parent / ".tmp"
        tmp_dir.mkdir(exist_ok=True)
        req_path = str(tmp_dir / f"req_{os.getpid()}.json")
        resp_path = str(tmp_dir / f"resp_{os.getpid()}.json")
        try:
            with open(req_path, "w") as f:
                json.dump(request, f)

            url = API_URL.format(model=MODEL) + f"?key={api_key}"
            result = subprocess.run(
                ["curl", "-s", "-X", "POST", "-H", "Content-Type: application/json",
                 "-o", resp_path, url, "-d", f"@{req_path}"],
                capture_output=True, text=True, timeout=600,
            )

            with open(resp_path) as f:
                data = json.load(f)

            if "error" in data:
                print(f"  API error: {data['error'].get('message', 'unknown')}", file=sys.stderr)
                return False

            # Check for IMAGE_RECITATION
            for candidate in data.get("candidates", []):
                if candidate.get("finishReason") == "IMAGE_RECITATION":
                    if attempt < len(PROMPTS) - 1:
                        print(f"  IMAGE_RECITATION, retrying with alternate prompt...")
                        continue
                    print(f"  IMAGE_RECITATION on all prompts, skipping.", file=sys.stderr)
                    return False

                for part in candidate.get("content", {}).get("parts", []):
                    if "inlineData" in part:
                        img_bytes = base64.b64decode(part["inlineData"]["data"])
                        output_path.parent.mkdir(parents=True, exist_ok=True)
                        output_path.write_bytes(img_bytes)
                        out_dims = get_dimensions(output_path)
                        print(f"  {in_dims} → {out_dims} ({len(img_bytes) // 1024}KB)")
                        return True

            if attempt < len(PROMPTS) - 1:
                print(f"  No image in response, retrying...")
                continue
            print(f"  No image data in API response.", file=sys.stderr)
            return False

        finally:
            for p in [req_path, resp_path]:
                try:
                    os.unlink(p)
                except OSError:
                    pass
            # Clean up .tmp dir if empty
            try:
                tmp_dir.rmdir()
            except OSError:
                pass

    return False


def compress(path: Path, quality: int, fmt: str) -> bool:
    """Compress image using baoyu-compress-image or ImageMagick fallback."""
    # Try baoyu-compress-image
    skill_script = None
    for search in [
        Path(__file__).resolve().parent.parent.parent / "baoyu-compress-image" / "scripts" / "main.ts",
        Path.cwd() / ".agents" / "skills" / "baoyu-compress-image" / "scripts" / "main.ts",
    ]:
        if search.is_file():
            skill_script = search
            break

    if skill_script:
        runtime = "bun" if shutil.which("bun") else "npx -y bun" if shutil.which("npx") else None
        if runtime:
            cmd = f'{runtime} "{skill_script}" "{path}" -f {fmt} -q {quality}'
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"  Compressed: {result.stdout.strip().split(chr(10))[-1]}")
                return True

    # Fallback: ImageMagick convert
    if shutil.which("convert"):
        result = subprocess.run(
            ["convert", str(path), "-quality", str(quality), str(path)],
            capture_output=True, text=True,
        )
        if result.returncode == 0:
            size_kb = path.stat().st_size // 1024
            print(f"  Compressed with ImageMagick ({size_kb}KB)")
            return True

    print("  Skipping compression (no compressor available)", file=sys.stderr)
    return False


def collect_images(input_path: Path) -> list[Path]:
    """Collect image files from a path (file or directory)."""
    if input_path.is_file():
        if input_path.suffix.lower() in IMAGE_EXTENSIONS:
            return [input_path]
        return []
    if input_path.is_dir():
        return sorted(p for p in input_path.rglob("*") if p.suffix.lower() in IMAGE_EXTENSIONS)
    return []


def main():
    parser = argparse.ArgumentParser(description="Upscale images with Gemini AI + compress")
    parser.add_argument("input", type=Path, help="Image file or directory")
    parser.add_argument("-o", "--output", type=Path, help="Output path (default: overwrite input)")
    parser.add_argument("-q", "--quality", type=int, default=82, help="Compression quality 0-100")
    parser.add_argument("-f", "--format", default="jpeg", choices=["jpeg", "png", "webp"])
    parser.add_argument("--skip-compress", action="store_true", help="Skip compression step")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be enhanced")
    parser.add_argument("--env-file", help="Path to env file with GEMINI_API_KEY")
    args = parser.parse_args()

    images = collect_images(args.input)
    if not images:
        print(f"No images found at {args.input}", file=sys.stderr)
        sys.exit(1)

    if args.dry_run:
        for img in images:
            dims = get_dimensions(img)
            size_kb = img.stat().st_size // 1024
            print(f"  {img} ({dims}, {size_kb}KB)")
        print(f"\n{len(images)} image(s) would be processed.")
        return

    api_key = load_api_key(args.env_file)
    is_dir_mode = args.input.is_dir()
    success, fail = 0, 0

    for img in images:
        # Determine output path
        if args.output:
            if is_dir_mode:
                out = args.output / img.relative_to(args.input)
            else:
                out = args.output
        else:
            out = img  # Overwrite in-place

        print(f"[{success + fail + 1}/{len(images)}] {img.name}")

        if upscale(img, out, api_key):
            if not args.skip_compress:
                compress(out, args.quality, args.format)
            success += 1
        else:
            fail += 1

    print(f"\nDone: {success} enhanced, {fail} failed out of {len(images)}")
    if fail:
        sys.exit(1)


if __name__ == "__main__":
    main()
