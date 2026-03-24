import type { PageContext } from "../types";

export function notFoundPage(_ctx: PageContext): string {
  return `
    <section class="page-section" style="text-align: center; padding-top: var(--space-3xl);">
      <h1 class="page-title">Page Not Found</h1>
      <p class="page-subtitle">The page you're looking for doesn't exist or may have moved.</p>
      <div style="margin-top: var(--space-xl);">
        <a href="/" class="hero-cta">Back to Home</a>
      </div>
    </section>
  `;
}
