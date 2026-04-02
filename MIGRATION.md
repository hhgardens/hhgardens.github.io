# Heather Hill Gardens — Migration Inventory

This document maps every page and asset from the legacy site to its disposition in the new Cloudflare Worker site.

## Page Migration

| Legacy Page | Legacy Path | Action | New Destination |
|---|---|---|---|
| Home | `index.html` | **Redirected** | `/` (seasonal homepage) |
| Home (Spring variant) | `ALTERNATIVE_HOMEPAGES/index_SpringOpening2025_remove_meta.html` | **Retired** | Content merged into `seasons.json` spring preset |
| Home (Fall Pumpkins variant) | `ALTERNATIVE_HOMEPAGES/index_FALLPUMPKINS_2025_remove_meta.html` | **Retired** | Content merged into `seasons.json` fall preset |
| Home (Fall Sale variant) | `ALTERNATIVE_HOMEPAGES/indexFallSale_remove_meta_tag.html` | **Retired** | Content merged into `seasons.json` fall preset |
| Favorite Plants | `FavoritePlants.htm` | **Merged → Redirected** | `/plants/` |
| Favorite Annuals | `FavoriteAnnuals.htm` | **Merged → Redirected** | `/plants/` (annuals section) |
| Favorite Perennials | `FavoritePerennials.htm` | **Merged → Redirected** | `/plants/` (perennials section) |
| Heather Hill Herbs | `HeatherHillHerbs.html` | **Merged → Redirected** | `/plants/` (herbs section) |
| Heather Hill Hostas | `HeatherHillHostas.html` | **Merged → Redirected** | `/plants/` (hostas section) |
| Recipes | `Recipes.html` | **Kept → Redirected** | `/recipes/` |
| Private Potting Party | `PrivatePottingParty.html` | **Kept → Redirected** | `/potting-parties/` |
| Directions | `Directions.htm` | **Merged → Redirected** | `/visit/` |
| Contact Us | `ContactUs.htm` | **Merged → Redirected** | `/visit/` |
| About Us | `About Us.htm` / `About%20Us.htm` | **Kept → Redirected** | `/about/` |
| Gardening Links | `GardeningLinks.htm` | **Retired → Redirected** | `/` (content retired) |
| Gardening Links (alt) | `Gardening%20Links.html` | **Retired → Redirected** | `/` (content retired) |

## New Information Architecture

| Route | Purpose | Source |
|---|---|---|
| `/` | Seasonal homepage (closed / spring / fall) | 3 legacy homepage variants |
| `/plants/` | Consolidated plants page | 5 legacy pages merged |
| `/recipes/` | Herb recipes with PDF downloads | `Recipes.html` modernized |
| `/potting-parties/` | Potting party service page | `PrivatePottingParty.html` modernized |
| `/visit/` | Location, hours, directions, contact | `Directions.htm` + `ContactUs.htm` merged |
| `/about/` | About the nursery | `About Us.htm` modernized |

## Redirect Map

All legacy URLs return 301 redirects to canonical routes. Defined in `content/redirects.json`.

```
FavoritePlants.htm       → /plants/
FavoriteAnnuals.htm      → /plants/
FavoritePerennials.htm   → /plants/
HeatherHillHerbs.html    → /plants/
HeatherHillHostas.html   → /plants/
Recipes.html             → /recipes/
Directions.htm           → /visit/
ContactUs.htm            → /visit/
About Us.htm             → /about/
About%20Us.htm           → /about/
GardeningLinks.htm       → /
Gardening%20Links.html   → /
PrivatePottingParty.html → /potting-parties/
index.html               → /
```

## Asset Migration

| Asset Category | Legacy Location | New Location | Notes |
|---|---|---|---|
| Favicon files (7) | `original_website/` root | `public/` root | Copied as-is |
| Plant images (~130) | `original_website/images/` | `public/images/` | Subdirectories lowercased |
| Seasonal images (Fall) | `original_website/images/Fall/` | `public/images/fall/` | Directory lowercased |
| 2022 seasonal images | `original_website/images/2022/` | `public/images/2022/` | Copied |
| 2024 seasonal images | `original_website/images/2024/` | `public/images/2024/` | Copied |
| 2025 seasonal images | `original_website/images/2025/` | `public/images/2025/` | Copied |
| Facebook images | `original_website/ImagesFB/` | `public/images/fb/` | Directory lowercased |
| Recipe PDFs (14+) | `original_website/Recipes/*.pdf` | `public/recipes/` | PDF only, no .doc/.docx |
| Banner images | `original_website/images/HHBanner*.jpg` | `public/images/` | Copied |

### Retired Assets

| Asset | Reason |
|---|---|
| `WS_FTP.LOG` files | Legacy FTP client logs |
| `_vti_cnf/` directories | Legacy FrontPage metadata |
| `CaptureSpring2019HomePageDRAFT.JPG` | Draft screenshot |
| `images/slideshow/` directory | Unused legacy slideshow thumbnails |
| `RawImages/` directory | Raw source material |
| `lightbox2.04-1/` library | Replaced by CSS gallery |
| `.doc`/`.docx` recipe files | PDF versions retained |

## Content Layer

All text content extracted from legacy HTML into structured JSON:

| File | Purpose |
|---|---|
| `content/site.json` | Business info: name, address, phone, email, social links, GA ID |
| `content/seasons.json` | 3 seasonal presets with `activeSeason` control field |
| `content/plants.json` | 4 categories: annuals, perennials (8), herbs (64), hostas (36+4+17) |
| `content/recipes.json` | 14 recipes with herb tags and PDF paths |
| `content/redirects.json` | 14 legacy URL → new route mappings |

## Seasonal Switching

The active season is controlled by one field in `content/seasons.json`:

```json
"activeSeason": "closed"  // or "spring" or "fall"
```

Changing this field updates:
- Homepage hero headline, body text, CTA, and images
- Footer hours display
- Announcement bar (spring/fall only)

No template or code changes required.
