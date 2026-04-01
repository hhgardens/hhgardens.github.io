---
name: image-enhance
description: >
  AI-powered image upscaling and compression pipeline using Gemini's image generation API.
  Use when user asks to "upscale image", "enhance image", "improve image quality",
  "fix blurry image", "increase image resolution", or wants to find and replace
  low-resolution images on a website. Handles end-to-end: identify blurry images,
  upscale via Gemini, and compress output with baoyu-compress-image.
---

# Image Enhance

Upscales low-resolution images via Google Gemini, then compresses the output.

## Prerequisites

- `GEMINI_API_KEY` in `.env` or `.dev.vars` in the workspace root (or exported in shell)
- `curl`, `python3`, `file` (standard on Linux/macOS)
- `identify` from ImageMagick (for dimension reporting — optional)
- `bun` or `npx` (for compression step)

## Script

`{baseDir}` = this SKILL.md's directory. The main script is `scripts/enhance.py`.

```bash
python3 {baseDir}/scripts/enhance.py <input> [options]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `<input>` | Image file or directory | Required |
| `--output`, `-o` | Output path (file or dir) | Overwrites input |
| `--quality`, `-q` | JPEG compression quality 0-100 | 82 |
| `--format`, `-f` | Output format: jpeg, png, webp | jpeg |
| `--skip-compress` | Skip compression step | false |
| `--dry-run` | Show what would be enhanced | false |
| `--env-file` | Path to env file | `.env` or `.dev.vars` |

## Workflow

1. **Identify** — Browse the site or scan a directory for low-res images.
   Find images where `display_size > natural_size` (upscaled in browser)
   or where natural dimensions are small (< 400px on longest side).

2. **Upscale** — Run the enhance script on each image:
   ```bash
   python3 {baseDir}/scripts/enhance.py public/images/SmallPhoto.jpg
   ```
   For a whole directory (in-place):
   ```bash
   python3 {baseDir}/scripts/enhance.py public/images/
   ```

3. **Compress** — Automatically handled by the script (uses baoyu-compress-image
   if available, falls back to ImageMagick). Skip with `--skip-compress`.

## API Key Setup

Store the Gemini API key in `.env` or `.dev.vars` at the workspace root:

```
GEMINI_API_KEY=AIza...
```

The script loads from (in priority order):
1. `GEMINI_API_KEY` environment variable
2. `--env-file` flag
3. `.dev.vars` in current or ancestor directories
4. `.env` in current or ancestor directories

## Lessons Learned

- Use `generateContent` endpoint, NOT `streamGenerateContent` — streaming returns
  chunked JSON that's hard to reassemble for large base64 image payloads.
- Save API responses to a temp file rather than a shell variable — responses
  contain megabytes of base64 data that can exceed shell limits.
- `IMAGE_RECITATION` errors occur when Gemini thinks the output too closely
  matches copyrighted material. Retry with the alternate prompt automatically.
- `personGeneration` and `aspectRatio` fields are not valid for this model —
  omit them from `imageConfig`.
- Set `thinkingLevel: MINIMAL` to reduce latency.
- Gemini upscales ~4-6× (e.g., 200px → 1024px). Output is high quality but
  large (500KB-1MB). Compression at q82 JPEG yields 64-79% reduction with
  no visible quality loss.
- Always compress after upscaling — raw Gemini output is unoptimized.
