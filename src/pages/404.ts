import type { PageContext } from "../types";

export function notFoundPage(_ctx: PageContext): string {
  return `
    <section class="page-section" style="text-align: center; padding-top: var(--space-3xl);">
      <h1 class="page-title">Page Not Found</h1>
      <p class="page-subtitle">The page you're looking for doesn't exist or may have moved.</p>
      <div style="margin-top: var(--space-xl);">
        <a href="/" class="btn btn-primary">Back to Home</a>
      </div>
      <div style="margin-top: var(--space-3xl); max-width: 480px; margin-left: auto; margin-right: auto;">
        <p style="font-size: 0.95rem; color: var(--text-light); margin-bottom: var(--space-lg);">You might be looking for:</p>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); justify-content: center;">
          <a href="/plants/" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1.2rem;">Our Plants</a>
          <a href="/recipes/" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1.2rem;">Herb Recipes</a>
          <a href="/visit/" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1.2rem;">Visit Us</a>
          <a href="/about/" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1.2rem;">About</a>
        </div>
      </div>
    </section>
  `;
}
