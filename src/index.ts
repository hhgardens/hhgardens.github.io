import siteData from "../content/site.json";
import seasonsData from "../content/seasons.json";
import plantsData from "../content/plants.json";
import recipesData from "../content/recipes.json";
import redirectsData from "../content/redirects.json";
import { layout } from "./templates/layout";
import { homePage } from "./pages/home";
import { plantsPage } from "./pages/plants";
import { recipesPage } from "./pages/recipes";
import { visitPage } from "./pages/visit";
import { aboutPage } from "./pages/about";
import { notFoundPage } from "./pages/404";
import type { SeasonPreset, ScheduleDay } from "./types";

const redirects: Record<string, string> = redirectsData as Record<string, string>;
const seasonDates = (seasonsData as { seasonDates: Record<string, string> }).seasonDates;

/** Determine which season is active based on today's date in Eastern time. */
function getActiveSeason(eastern: Date): string {
  const m = String(eastern.getMonth() + 1).padStart(2, "0");
  const d = String(eastern.getDate()).padStart(2, "0");
  const mmdd = `${m}-${d}`;

  // Walk the calendar in reverse order: closed → fall → spring
  // Each entry means "from this MM-DD onward, use this season"
  const entries = Object.entries(seasonDates)
    .sort((a, b) => b[1].localeCompare(a[1])); // descending by date

  for (const [season, startDate] of entries) {
    if (mmdd >= startDate) return season;
  }

  // Before the earliest date in the calendar → use the last season
  // (wraps around, e.g. Jan–Mar is still "closed" from Nov 5)
  return entries[0][0];
}

/** Compute a dynamic announcement based on current Eastern-time date/time. */
function getDynamicAnnouncement(season: SeasonPreset): string | null {
  if (!season.schedule || !season.seasonStart) {
    return season.announcement;
  }

  // Current time in Eastern timezone
  const now = new Date();
  const eastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const y = eastern.getFullYear();
  const m = String(eastern.getMonth() + 1).padStart(2, "0");
  const d = String(eastern.getDate()).padStart(2, "0");
  const today = `${y}-${m}-${d}`;

  // Before season opens — show the static pre-season announcement
  if (today < season.seasonStart) {
    return season.announcement;
  }

  const dayOfWeek = eastern.getDay(); // 0=Sun … 6=Sat
  const currentMinutes = eastern.getHours() * 60 + eastern.getMinutes();

  const todaySchedule: ScheduleDay | undefined =
    season.schedule[dayOfWeek.toString()];

  if (todaySchedule) {
    const [closeH, closeM] = todaySchedule.close.split(":").map(Number);
    const closeMin = closeH * 60 + closeM;

    if (currentMinutes < closeMin) {
      return `Today's Hours: ${todaySchedule.openDisplay} – ${todaySchedule.closeDisplay}`;
    }
    // Past closing — fall through to "next open day"
  }

  // Find the next open day
  for (let i = 1; i <= 7; i++) {
    const nextDay = (dayOfWeek + i) % 7;
    const nextSchedule: ScheduleDay | undefined =
      season.schedule[nextDay.toString()];
    if (nextSchedule) {
      const label = i === 1 ? "tomorrow" : nextSchedule.name;
      return `${label === "tomorrow" ? "Open tomorrow" : `Opens ${label}`}: ${nextSchedule.openDisplay} – ${nextSchedule.closeDisplay}`;
    }
  }

  return season.announcement;
}

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown): Promise<Response> {
    const url = new URL(request.url);
    let path = url.pathname;
    const origin = url.origin;

    // Normalize: strip trailing slash except root
    if (path !== "/" && path.endsWith("/")) {
      path = path.slice(0, -1);
    }

    // robots.txt
    if (path === "/robots.txt") {
      return new Response(
        `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
        { headers: { "Content-Type": "text/plain" } }
      );
    }

    // sitemap.xml
    if (path === "/sitemap.xml") {
      const today = new Date().toISOString().split("T")[0];
      const pages = ["/", "/plants", "/recipes", "/visit", "/about"];
      const entries = pages.map(
        (p) => `  <url><loc>${origin}${p}</loc><lastmod>${today}</lastmod></url>`
      ).join("\n");
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`,
        { headers: { "Content-Type": "application/xml" } }
      );
    }

    // Legacy /Recipes/... → /recipes/... (case-insensitive folder redirect)
    if (path.toLowerCase().startsWith("/recipes/") && path !== path.toLowerCase()) {
      return Response.redirect(new URL("/recipes/" + path.slice("/recipes/".length), url.origin).toString(), 301);
    }

    // Check legacy redirects (try raw path segment without leading slash)
    const bare = path.startsWith("/") ? path.slice(1) : path;
    const decodedBare = decodeURIComponent(bare);
    const redirectTarget = redirects[bare] ?? redirects[decodedBare];
    if (redirectTarget) {
      return Response.redirect(new URL(redirectTarget, url.origin).toString(), 301);
    }

    // Determine active season and compute dynamic announcement per request
    const now = new Date();
    const eastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const activeSeason = getActiveSeason(eastern);
    const baseSeason = seasonsData.presets[activeSeason as keyof typeof seasonsData.presets];
    const season = { ...baseSeason, announcement: getDynamicAnnouncement(baseSeason as SeasonPreset) };
    const ctx = { site: siteData, season, seasons: seasonsData, plants: plantsData, recipes: recipesData };
    let pageContent: string | null = null;
    let title = siteData.name;
    let description = siteData.metaDescription;
    const canonicalUrl = `${origin}${path === "/" ? "" : path}`;
    const ogImage = `${origin}/images/og-hero-with-logo.jpg`;

    switch (path) {
      case "/":
        title = `${siteData.name} — ${season.heroHeadline}`;
        pageContent = homePage(ctx);
        break;
      case "/plants":
        title = `Our Plants — ${siteData.name}`;
        description = "Explore native plants, perennials, hostas, herbs, and annuals at Heather Hill Gardens — a plant nursery and garden center in Fairfax Station, Virginia.";
        pageContent = plantsPage(ctx);
        break;
      case "/recipes":
        title = `Herb Recipes — ${siteData.name}`;
        description = "Download our favorite herb recipes — Victorian lavender cream scones, lavender lemonade, genovese basil pesto, and more.";
        pageContent = recipesPage(ctx);
        break;
      case "/visit":
        title = `Visit Us — ${siteData.name}`;
        description = "Find us at 8111 Ox Road, Fairfax Station, Virginia. Directions, hours, and contact information.";
        pageContent = visitPage(ctx);
        break;
      case "/about":
        title = `About Us — ${siteData.name}`;
        description = "The story of Heather Hill Gardens — a family-owned plant nursery and garden center in Fairfax Station, Virginia.";
        pageContent = aboutPage(ctx);
        break;
      default:
        // Let Wrangler handle static assets; if we get here it's a 404
        return htmlResponse(
          layout({ title: `Not Found — ${siteData.name}`, description, content: notFoundPage(ctx), site: siteData, season, activeSeason, currentPath: path, noindex: true }),
          404
        );
    }

    return htmlResponse(layout({ title, description, content: pageContent, site: siteData, season, activeSeason, currentPath: path, canonicalUrl, ogImage }));
  },
} satisfies ExportedHandler;
