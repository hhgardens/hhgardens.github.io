import type { PageContext } from "../types";

export function aboutPage(ctx: PageContext): string {
  const { site } = ctx;

  return `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text about-hero-text">
          <h1>About Heather Hill Gardens</h1>
          <p>A family-owned nursery on Ox Road in Fairfax Station, Virginia — what started as a passion for growing has become a destination for gardeners across Northern Virginia.</p>
        </div>
        <div class="hero-images single">
          <img src="/images/OverviewUmbVertical.jpg" alt="Heather Hill Gardens property" loading="eager">
        </div>
      </div>
    </section>

    <section class="page-section">
      <div style="max-width: var(--content-width); margin: 0 auto;">
        <h2 class="section-title">What We Grow</h2>
        <p style="margin-bottom:var(--space-lg); line-height:1.8; font-size:0.975rem;">
          We specialize in unusual and distinctive perennials, hostas, herbs, and annuals — plants chosen specifically for Virginia gardens. We're especially proud of our native plant selections, species indigenous to Northern Virginia that support local pollinators and thrive naturally in our soil and climate. Our collection includes over 60 herb varieties, more than 20 hosta cultivars, and a carefully curated selection of perennials.
        </p>
        <p style="margin-bottom:var(--space-lg); line-height:1.8; font-size:0.975rem;">
          We're proud to carry <strong>Proven Winners®</strong> plants and work closely with suppliers who share our commitment to quality. Whether you're looking for deer-resistant perennials, shade-loving hostas, or fresh herbs for your kitchen garden, we can help you find exactly what you need.
        </p>

        <div class="divider" aria-hidden="true">· · ·</div>

        <h2 class="section-title">What We Offer</h2>
        <div class="card-grid" style="margin-bottom:var(--space-2xl);">
          <div class="card">
            <div class="card-body">
              <h3>Expert Advice</h3>
              <p>Tell us about your growing conditions — sun, shade, drainage, deer pressure — and we'll recommend plants that will thrive in your specific situation.</p>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h3>Native Plants</h3>
              <p>We carry plants native to Northern Virginia — species that support local pollinators and thrive in our climate with minimal care.</p>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h3>Seasonal Selections</h3>
              <p>From spring perennials and pansies to fall mums and pumpkins, we curate a seasonal selection that brings beauty to your yard year-round.</p>
            </div>
          </div>
        </div>

        <div class="divider" aria-hidden="true">· · ·</div>

        <h2 class="section-title">Find Us</h2>
        <p style="margin-bottom:var(--space-lg); line-height:1.8; font-size:0.975rem;">
          We're located at <strong>${site.address}</strong> — look for the blue Victorian house on Ox Road (Route 123). Our customers come from across Northern Virginia, including Alexandria, Arlington, Burke, Centreville, Fairfax, Falls Church, McLean, Reston, Springfield, Vienna, and beyond.
        </p>
        <a href="/visit" class="btn btn-primary">Get Directions &amp; Hours</a>
      </div>
    </section>
  `;
}
