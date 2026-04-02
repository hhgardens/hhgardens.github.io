import type { PageContext } from "../types";

export function visitPage(ctx: PageContext): string {
  const { site, season } = ctx;

  return `
    <section class="page-section">
      <h1 class="page-title">Visit Heather Hill Gardens</h1>
      <p class="page-subtitle">Farmers' market featuring a variety of plants, vegetables, and produce, plus local honey.</p>

      <div class="info-grid">
        <div class="info-block">
          <h3>Location</h3>
          <p>8111 Ox Rd, Fairfax Station, VA 22039</p>
          <p><a href="${site.googleMapsUrl}" target="_blank" rel="noopener">Open in Google Maps &rarr;</a></p>

          <h3 style="margin-top:var(--space-xl);">Hours</h3>
          <p style="font-size:1.05rem; font-weight:600; color:var(--sage-dark); font-family:var(--font-display);">${season.hours}</p>

          <h3 style="margin-top:var(--space-xl);">Contact</h3>
          <p>
            <a href="tel:703-690-6060">(703) 690-6060</a><br>
            <a href="mailto:${site.email}">${site.email}</a>
          </p>
        </div>

        <div class="info-block">
          <h3>Getting Here</h3>
          <p>We're on Ox Road (Route 123) in South Run, Fairfax Station &mdash; look for the blue Victorian house.</p>

          <h3 style="margin-top:var(--space-lg);">From I-95 North</h3>
          <ol>
            <li>Take exit 160B onto Route 123 North</li>
            <li>Continue north on 123 for approximately 5 miles, staying in the right lanes</li>
            <li>Look for the blue Victorian house on the right, about 1/10 mile past the traffic light at Silverbrook Road</li>
          </ol>
        </div>
      </div>

      <div style="margin-top: var(--space-2xl); border-radius: 10px; overflow: hidden; border: 1px solid var(--border);">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.148190327017!2d-77.2814819!3d38.7373615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b653d9ef973b3b%3A0xcda6d9ffc92df62!2sHeather%20Hill%20Gardens!5e0!3m2!1sen!2sus!4v1775079627069!5m2!1sen!2sus"
          width="100%"
          height="350"
          style="border:0; display:block;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Heather Hill Gardens location on Google Maps">
        </iframe>
      </div>

      <div class="photo-grid-2">
        <img src="/images/nursery/HeatherHillHouse.jpg" alt="The blue Victorian house at Heather Hill Gardens on Ox Road" loading="lazy">
        <img src="/images/nursery/HHFromTheRoadSmall2.jpg" alt="Heather Hill Gardens as seen from Route 123" loading="lazy">
      </div>
    </section>

    <div class="cta-section">
      <h2 class="section-title">Questions?</h2>
      <p class="section-intro">
        Whether you need gardening advice or have a special request &mdash; we're here to help.
      </p>
      <div class="cta-buttons">
        <a href="mailto:${site.email}" class="btn btn-primary">Email Us</a>
        <a href="tel:703-690-6060" class="btn btn-secondary">Call (703) 690-6060</a>
      </div>
    </div>
  `;
}
