## Project Overview

This workspace contains the current live site and the new Cloudflare Worker site under development for Heather Hill Gardens Productions LLC.

- Current live site: https://heatherhillgardens.com/
- New Worker site: https://new2.heatherhillgardens.com/

The new site is the primary workspace target. It is a Cloudflare Worker serving static assets from `public/` with routing handled in `src/index.ts`.

## Project Structure

```
heatherhillgardens/
├── content/                   # JSON content layer
│   ├── site.json              # Business info, contact, SEO
│   ├── seasons.json           # Seasonal presets (closed/spring/fall)
│   ├── plants.json            # All plant data
│   ├── recipes.json           # Recipe list with PDF paths
│   └── redirects.json         # Legacy URL redirect map
├── public/                    # Static assets (images, PDFs, favicons)
│   ├── images/                # Plant, property, and seasonal photos
│   └── recipes/               # Downloadable recipe PDFs
├── src/
│   ├── index.ts               # Cloudflare Worker entry point & routing
│   ├── types.ts               # TypeScript interfaces
│   ├── templates/layout.ts    # Shared HTML layout, nav, footer, CSS
│   └── pages/                 # Page-specific HTML generators
│       ├── home.ts            # Seasonal homepage
│       ├── plants.ts          # Consolidated plants page
│       ├── recipes.ts         # Recipe downloads
│       ├── potting-parties.ts # Service page
│       ├── visit.ts           # Directions + contact
│       ├── about.ts           # About the nursery
│       └── 404.ts             # Not found page
├── wrangler.jsonc             # Cloudflare config (new2.heatherhillgardens.com)
├── package.json               # Scripts and tooling
├── MIGRATION.md               # Legacy page migration inventory
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
