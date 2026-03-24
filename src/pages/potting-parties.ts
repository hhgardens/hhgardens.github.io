import type { PageContext } from "../types";

export function pottingPartiesPage(ctx: PageContext): string {
  const { site } = ctx;

  const galleryImages = [
    { src: "/images/HappyPlantChooser.jpg", caption: "Choosing plants" },
    { src: "/images/GettingExpertHelp.jpg", caption: "Getting expert help" },
    { src: "/images/ReadySetPlant.jpg", caption: "Ready, set, plant!" },
    { src: "/images/PlantedContainer.jpg", caption: "The finished product" },
  ];

  const gallery = galleryImages
    .map(
      (img) => `
      <div class="gallery-item">
        <img src="${img.src}" alt="${img.caption}" loading="lazy">
        <div class="gallery-caption">${img.caption}</div>
      </div>`
    )
    .join("");

  return `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1>Private Potting Parties</h1>
          <p>Gather your book club, your garden club, your family, or your friends — and come plant with us! We provide the plants, soil, fertilizer, and expert guidance. You bring your containers and your creativity.</p>
          <a href="mailto:${site.email}?subject=Potting Party Inquiry" class="btn btn-primary">Book a Party</a>
        </div>
        <div class="hero-images single">
          <img src="/images/HappyPlantChooser.jpg" alt="Potting party at Heather Hill Gardens" loading="eager">
        </div>
      </div>
    </section>

    <section class="page-section">
      <h2 class="section-title">How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Pick Your Plants</h3>
          <p>Browse our selection and choose the plants that speak to you.</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>We Provide the Rest</h3>
          <p>Potting soil, fertilizer, and all the supplies you need.</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Design Together</h3>
          <p>Our experts help you create beautiful container arrangements.</p>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <h3>Take It Home</h3>
          <p>Load up your gorgeous creations and enjoy them all season.</p>
        </div>
      </div>
    </section>

    <div class="divider" aria-hidden="true">· · ·</div>

    <section class="page-section" style="padding-top:0;">
      <h2 class="section-title">Party Gallery</h2>
      <div class="gallery-grid">
        ${gallery}
      </div>
    </section>

    <div class="cta-section">
      <h2 class="section-title">Ready to Plan Your Party?</h2>
      <p class="section-intro">
        Contact us to check availability and discuss your group's needs. Potting parties are perfect for garden clubs, book clubs, quilting bees, and family gatherings.
      </p>
      <div class="cta-buttons">
        <a href="mailto:${site.email}?subject=Potting Party Inquiry" class="btn btn-primary">Email Us</a>
        <a href="tel:${site.phone.replace(/\./g, "-")}" class="btn btn-secondary">Call ${site.phone}</a>
      </div>
    </div>
  `;
}
