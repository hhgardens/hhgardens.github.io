import type { PageContext } from "../types";

export function visitPage(ctx: PageContext): string {
  const { site, season } = ctx;

  return `
    <section class="page-section">
      <h1 class="page-title">Visit Heather Hill Gardens</h1>
      <p class="page-subtitle">We'd love to see you. Here's how to find us.</p>

      <div class="info-grid">
        <div class="info-block">
          <h3>Location</h3>
          <p>${site.address}</p>
          <p><a href="${site.googleMapsUrl}" target="_blank" rel="noopener">Open in Google Maps →</a></p>

          <h3 style="margin-top:var(--space-xl);">Hours</h3>
          <p style="font-size:1.05rem; font-weight:600; color:var(--sage-dark); font-family:var(--font-display);">${season.hours}</p>

          <h3 style="margin-top:var(--space-xl);">Contact</h3>
          <p>
            <a href="tel:${site.phone.replace(/\./g, "-")}">${site.phone}</a><br>
            <a href="mailto:${site.email}">${site.email}</a>
          </p>
        </div>

        <div class="info-block">
          <h3>Getting Here</h3>
          <p>Heather Hill Gardens is located on Ox Road (Route 123) in Fairfax Station, Virginia — look for the blue Victorian house.</p>

          <h3 style="margin-top:var(--space-lg);">From I-95 North</h3>
          <ol>
            <li>Take exit 160B onto Route 123 North</li>
            <li>Continue north on 123 for approximately 5 miles, staying in the right lanes</li>
            <li>Look for the blue Victorian house on the right, about 1/10 mile past the traffic light at Silverbrook Road</li>
          </ol>
        </div>
      </div>

      <div class="photo-grid-2">
        <img src="/images/HeatherHillHouse.jpg" alt="Heather Hill Gardens — the blue Victorian house" loading="lazy">
        <img src="/images/HHFromTheRoadSmall2.jpg" alt="View from Route 123" loading="lazy">
      </div>
    </section>

    <div class="cta-section">
      <h2 class="section-title">Questions?</h2>
      <p class="section-intro">
        Whether you need gardening advice, want to plan a potting party, or have a special request — we're here to help.
      </p>
      <div class="cta-buttons">
        <a href="mailto:${site.email}" class="btn btn-primary">Email Us</a>
        <a href="tel:${site.phone.replace(/\./g, "-")}" class="btn btn-secondary">Call ${site.phone}</a>
      </div>
    </div>
  `;
}
