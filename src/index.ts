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

const redirects: Record<string, string> = redirectsData as Record<string, string>;

const season =
  seasonsData.presets[seasonsData.activeSeason as keyof typeof seasonsData.presets];

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: Record<string, unknown>): Promise<Response> {
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
      const pages = ["/", "/plants", "/recipes", "/visit", "/about"];
      const entries = pages.map(
        (p) => `  <url><loc>${origin}${p}</loc></url>`
      ).join("\n");
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`,
        { headers: { "Content-Type": "application/xml" } }
      );
    }

    // Check legacy redirects (try raw path segment without leading slash)
    const bare = path.startsWith("/") ? path.slice(1) : path;
    const decodedBare = decodeURIComponent(bare);
    const redirectTarget = redirects[bare] ?? redirects[decodedBare];
    if (redirectTarget) {
      return Response.redirect(new URL(redirectTarget, url.origin).toString(), 301);
    }

    // Page routing
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
        description = "Explore our favorite annuals, perennials, herbs, and hostas at Heather Hill Gardens in Fairfax Station, Virginia.";
        pageContent = plantsPage(ctx);
        break;
      case "/recipes":
        title = `Herb Recipes — ${siteData.name}`;
        description = "Download our favorite herb recipes — from lavender lemonade to genovese basil pesto.";
        pageContent = recipesPage(ctx);
        break;
      case "/visit":
        title = `Visit Us — ${siteData.name}`;
        description = "Find us at 8111 Ox Road, Fairfax Station, Virginia. Directions, hours, and contact information.";
        pageContent = visitPage(ctx);
        break;
      case "/about":
        title = `About Us — ${siteData.name}`;
        description = "The story of Heather Hill Gardens — a family nursery in Fairfax Station, Virginia.";
        pageContent = aboutPage(ctx);
        break;
      default:
        // Let Wrangler handle static assets; if we get here it's a 404
        return htmlResponse(
          layout({ title: `Not Found — ${siteData.name}`, description, content: notFoundPage(ctx), site: siteData, season, activeSeason: seasonsData.activeSeason, currentPath: path }),
          404
        );
    }

    return htmlResponse(layout({ title, description, content: pageContent, site: siteData, season, activeSeason: seasonsData.activeSeason, currentPath: path, canonicalUrl, ogImage }));
  },
} satisfies ExportedHandler;
