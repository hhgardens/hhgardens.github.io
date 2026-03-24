import siteData from "../content/site.json";
import seasonsData from "../content/seasons.json";
import plantsData from "../content/plants.json";
import recipesData from "../content/recipes.json";
import redirectsData from "../content/redirects.json";
import { layout } from "./templates/layout";
import { homePage } from "./pages/home";
import { plantsPage } from "./pages/plants";
import { recipesPage } from "./pages/recipes";
import { pottingPartiesPage } from "./pages/potting-parties";
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

    // Normalize: strip trailing slash except root
    if (path !== "/" && path.endsWith("/")) {
      path = path.slice(0, -1);
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
      case "/potting-parties":
        title = `Potting Parties — ${siteData.name}`;
        description = "Book a private potting party at Heather Hill Gardens. We provide the plants, soil, and expertise — you bring the fun.";
        pageContent = pottingPartiesPage(ctx);
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
          layout({ title: `Not Found — ${siteData.name}`, description, content: notFoundPage(ctx), site: siteData, season, activeSeason: seasonsData.activeSeason }),
          404
        );
    }

    return htmlResponse(layout({ title, description, content: pageContent, site: siteData, season, activeSeason: seasonsData.activeSeason }));
  },
} satisfies ExportedHandler;
