import type { PageContext } from "../types";

export function plantsPage(ctx: PageContext): string {
  const { plants } = ctx;
  const categories = plants.categories;

  // ── Overview cards (image + blurb for each category) ──
  const overviewCards = categories
    .map((cat) => {
      const desc = cat.overviewDescription || cat.description;
      return `
      <a href="#${cat.id}" class="plant-overview-card">
        <figure>
          <img src="${cat.image}" alt="${cat.name}" loading="lazy">
          ${cat.imageCaption ? `<figcaption>${cat.imageCaption}</figcaption>` : ""}
        </figure>
        <div class="plant-overview-text">
          <h2>${cat.name}</h2>
          <p>${desc}</p>
          <span class="plant-overview-link">Explore ${cat.name} →</span>
        </div>
      </a>`;
    })
    .join(`\n      <hr class="overview-divider">`);

  // ── Detailed sections ──
  const sections = categories.map((cat, idx) => {
    let content = "";

    if (cat.id === "annuals") {
      content = `
        <div class="category-intro">
          <figure>
            <img src="${cat.image}" alt="${cat.name}" loading="lazy">
          </figure>
          <div class="category-intro-text">
            <p class="section-intro">${cat.description}</p>
            ${cat.whyUseThem ? `<p class="section-intro">${cat.whyUseThem}</p>` : ""}
          </div>
        </div>
        ${cat.pageIntro ? `<p class="section-intro">${cat.pageIntro}</p>` : ""}
      `;
    } else if (cat.id === "herbs") {
      const featuredImgs = (cat.featuredImages || [])
        .map(
          (img) => `
        <div class="gallery-item">
          <img src="${img.src}" alt="${img.alt}" loading="lazy">
          <div class="gallery-caption">${img.caption}</div>
        </div>`
        )
        .join("");

      const groups: Record<string, string[]> = {};
      for (const p of cat.plants) {
        const key = p.name;
        if (!groups[key]) groups[key] = [];
        if (p.variety) groups[key].push(p.variety);
      }
      const herbList = Object.entries(groups)
        .map(
          ([name, varieties]) =>
            `<li><span class="plant-name">${name}</span>${
              varieties.length ? ` <span class="plant-variety">— ${varieties.join(", ")}</span>` : ""
            }</li>`
        )
        .join("");

      content = `
        <p class="section-intro">${cat.description}</p>
        <div class="gallery-grid" style="margin-bottom:var(--space-xl);">${featuredImgs}</div>
        <h3 style="font-family:var(--font-display); font-size:1.25rem; font-weight:600; color:var(--sage-dark); margin-bottom:var(--space-md); letter-spacing:-0.01em;">Our Herb Collection</h3>
        <ul class="plant-list">${herbList}</ul>
      `;
    } else if (cat.id === "hostas") {
      const featured = (cat.featured || [])
        .map(
          (h) => `
        <div class="card">
          ${h.image ? `<div class="card-img-wrap"><img src="${h.image}" alt="${h.name}" loading="lazy"></div>` : ""}
          <div class="card-body">
            <h3>${h.name}</h3>
            <p>${h.description || ""}</p>
          </div>
        </div>`
        )
        .join("");

      const gallery = (cat.gallery || [])
        .map(
          (g) => `
        <div class="gallery-item">
          <img src="${g.src}" alt="${g.name}" loading="lazy">
          <div class="gallery-caption">${g.name}</div>
        </div>`
        )
        .join("");

      content = `
        <p class="section-intro">${cat.description}</p>
        <div class="card-grid" style="margin-bottom:var(--space-2xl);">${featured}</div>
        <h3 style="font-family:var(--font-display); font-size:1.25rem; font-weight:600; color:var(--sage-dark); margin-bottom:var(--space-md); letter-spacing:-0.01em;">Our Hosta Gallery</h3>
        <div class="gallery-grid">${gallery}</div>
      `;
    } else if (cat.id === "perennials") {
      const plantCards = (cat.plants || [])
        .map((p) => {
          const varieties = (p.varieties || [])
            .map(
              (v) => `
            <div class="variety-row">
              ${v.image ? `<img src="${v.image}" alt="${v.name}" loading="lazy">` : ""}
              <div>
                <strong style="font-size:0.95rem; color:var(--text);">${v.name}</strong>${v.trademark ? ` <span class="tag">${v.trademark}</span>` : ""}
                ${v.description ? `<p style="font-size:0.88rem; color:var(--text-light); margin-top:var(--space-xs); line-height:1.6;">${v.description}</p>` : ""}
              </div>
            </div>`
            )
            .join("");
          const tags = (p.tags || [])
            .map((t) => `<span class="tag${t === 'native' ? ' tag-native' : ''}">${t === 'native' ? '🌿 Native' : t}</span>`)
            .join("");
          return `
          <div style="margin-bottom:var(--space-2xl); padding-bottom:var(--space-xl); border-bottom:1px solid var(--border);">
            <h3 style="font-family:var(--font-display); font-size:1.3rem; font-weight:700; color:var(--sage-dark); margin-bottom:var(--space-sm); letter-spacing:-0.015em;">${p.name}</h3>
            ${p.description ? `<p style="margin-bottom:var(--space-sm); font-size:0.95rem; line-height:1.75;">${p.description}</p>` : ""}
            ${tags ? `<div style="margin-bottom:var(--space-md);">${tags}</div>` : ""}
            ${varieties}
          </div>`;
        })
        .join("");

      content = `
        <p class="section-intro">${cat.description}</p>
        ${plantCards}
      `;
    }

    const divider = idx < categories.length - 1
      ? `<div class="divider" aria-hidden="true">· · ·</div>`
      : "";

    return `
      <div id="${cat.id}" style="scroll-margin-top: 80px;">
        <h2 class="section-title">${cat.name}</h2>
        ${content}
      </div>
      ${divider}
    `;
  }).join("");

  return `
    <section class="page-section">
      <h1 class="page-title">Our Plants</h1>
      <p class="page-subtitle">${plants.intro}</p>

      <div class="plant-overview">
        ${overviewCards}
      </div>

      ${sections}
    </section>
  `;
}
