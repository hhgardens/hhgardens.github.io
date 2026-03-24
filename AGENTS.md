## Project Overview

This workspace contains the current live site and the new Cloudflare Worker site under development for Heather Hill Gardens Productions LLC.

- Current live site: https://heatherhillgardens.com/
- New Worker site: https://new.heatherhillgardens.com/

The new site is the primary workspace target. It is a Cloudflare Worker serving static assets from `public/` with routing handled in `src/index.ts`.

## Project Structure

```
heatherhillgardens/
├── public/                    # Static site assets and HTML
│   └── assets/web/            # CSS, JS, thumbnails, hero clip
├── scripts/video-pipeline.mjs # Video compression, hero, previews, R2 upload
├── src/index.ts               # Cloudflare Worker entry point
├── videos/
│   ├── manifest.json          # Pipeline config (sources, outputs, hero, previews)
│   ├── uncompressed/          # Raw source videos (gitignored)
│   └── compressed/            # Compressed outputs and preview clips
├── wrangler.jsonc             # Cloudflare config for the new site
├── package.json               # Scripts and tooling
└── AGENTS.md                  # This file
```

## Working Rules

- Use the browser to inspect the site at http://localhost:8787 when it is running.
- If the dev server is not running, start it with `npm run dev` before trying to review changes in the browser.
- If you have a built in browser available, the browser panel viewport is constrained by the VS Code panel size and cannot be resized programmatically beyond it. `setViewportSize` calls that exceed the panel width silently fail. To verify layouts at specific breakpoints (desktop, tablet, mobile), ask the user to manually resize their browser window or share screenshots at the needed sizes.
- Keep edits aligned with the current Heather Hill Gardens brand and the existing static-site architecture.
- Prefer small, focused changes unless the user explicitly asks for a broader redesign or rewrite.

## Commands

```bash
npm run dev              # Start the local Cloudflare dev server
npm run deploy           # Deploy the Worker site to Cloudflare
```
