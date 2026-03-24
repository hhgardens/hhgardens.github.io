import type { PageContext } from "../types";

export function recipesPage(ctx: PageContext): string {
  const { recipes } = ctx;

  const recipeCards = recipes.recipes
    .map(
      (r) => `
      <div class="recipe-card">
        <div class="recipe-info">
          <h3>${r.name}</h3>
          <p class="recipe-herbs">${r.herbs.join(" · ")}</p>
        </div>
        <a href="${r.pdf}" class="recipe-download" download>
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Download PDF
        </a>
      </div>`
    )
    .join("\n");

  return `
    <section class="page-section">
      <h1 class="page-title">Herb Recipes</h1>
      <p class="page-subtitle">${recipes.intro}</p>

      <div class="gallery-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: var(--space-2xl);">
        <div class="gallery-item">
          <img src="/images/BasilGenovese.jpg" alt="Basil Genovese" loading="lazy">
          <div class="gallery-caption">Basil</div>
        </div>
        <div class="gallery-item">
          <img src="/images/ParsleyCurly.jpg" alt="Curly Parsley" loading="lazy">
          <div class="gallery-caption">Parsley</div>
        </div>
        <div class="gallery-item">
          <img src="/images/SageTricolor.jpg" alt="Tricolor Sage" loading="lazy">
          <div class="gallery-caption">Sage</div>
        </div>
        <div class="gallery-item">
          <img src="/images/Peppermint.jpg" alt="Peppermint" loading="lazy">
          <div class="gallery-caption">Peppermint</div>
        </div>
      </div>

      <div class="recipe-list">
        ${recipeCards}
      </div>
    </section>
  `;
}
