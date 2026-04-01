import type { PageContext } from "../types";

export function homePage(ctx: PageContext): string {
  const { season, site } = ctx;
  const imageCount = season.heroImages.length;
  const imageClass =
    imageCount === 1 ? "single" : imageCount >= 3 ? "multi triple" : "multi";

  const images = season.heroImages
    .map((src) => `<img src="${src}" alt="${site.name}" loading="eager">`)
    .join("\n        ");

  const extraBody = season.heroBodyExtra
    ? `<p>${season.heroBodyExtra}</p>`
    : "";

  return `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1>${season.heroHeadline}</h1>
          <p>${season.heroBody}</p>
          ${extraBody}
          <a href="${season.ctaHref}" class="btn btn-primary">${season.ctaText}</a>
        </div>
        <div class="hero-images ${imageClass}">
          ${images}
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="card-grid-3">
        <a href="/plants" class="card" style="text-decoration:none;">
          <div class="card-img-wrap">
            <img src="/images/HerbTableforWeb.jpg" alt="Fresh herbs and plants" loading="lazy">
          </div>
          <div class="card-body">
            <h3>Our Plants</h3>
            <p>Perennials, hostas, herbs, and annuals — chosen for Virginia gardens.</p>
          </div>
        </a>
        <a href="/plants" class="card" style="text-decoration:none;">
          <div class="card-img-wrap">
            <img src="/images/BaptisiaCarolinaMoonlight (2).jpg" alt="Native Baptisia in bloom" loading="lazy">
          </div>
          <div class="card-body">
            <h3>Native Plants</h3>
            <p>Northern Virginia natives that thrive in our climate — beautiful, resilient, and low-maintenance.</p>
          </div>
        </a>
        <a href="/recipes" class="card" style="text-decoration:none;">
          <div class="card-img-wrap">
            <img src="/images/BasilGenovese.jpg" alt="Fresh basil" loading="lazy">
          </div>
          <div class="card-body">
            <h3>Herb Recipes</h3>
            <p>From lavender lemonade to genovese pesto — our favorites.</p>
          </div>
        </a>
      </div>
    </section>

    <div class="cta-section">
      <h2 class="section-title">Keep in Touch</h2>
      <p class="section-intro">
        Would you like to hear from us? Join our mailing list for seasonal updates, new plant arrivals, and garden tips.
      </p>
      <a href="mailto:${site.email}?subject=Add Me To Your Mailing List" class="btn btn-primary">Join Our Mailing List</a>
    </div>
  `;
}
