import type { SiteData, SeasonPreset } from "../types";

interface LayoutOptions {
  title: string;
  description: string;
  content: string;
  site: SiteData;
  season: SeasonPreset;
  activeSeason?: string;
  currentPath?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noindex?: boolean;
}

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/plants", label: "Plants" },
  { href: "/recipes", label: "Recipes" },
  { href: "/visit", label: "Visit" },
  { href: "/about", label: "About" },
];

export function layout({ title, description, content, site, season, activeSeason, currentPath, canonicalUrl, ogImage, noindex }: LayoutOptions): string {
  const navLinks = NAV_ITEMS.map(
    (item) => {
      const isActive = currentPath === item.href || (item.href !== "/" && currentPath?.startsWith(item.href));
      return `<a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.label}</a>`;
    }
  ).join("\n            ");

  const announcementClass =
    activeSeason === "spring" ? "season-spring" :
    activeSeason === "fall"   ? "season-fall"   : "season-closed";

  const announcementBar = season.announcement
    ? `<div class="announcement-bar ${announcementClass}">${season.announcement}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${site.metaKeywords}">
  <meta name="google-site-verification" content="${site.googleSiteVerification}">
  <meta name="theme-color" content="#4A6741">
  ${noindex ? '<meta name="robots" content="noindex">' : ''}
  ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}">` : ""}

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  ${canonicalUrl ? `<meta property="og:url" content="${canonicalUrl}">` : ""}
  ${ogImage ? `<meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">` : ""}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  ${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : ""}

  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>${CSS}</style>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${site.gaId}');
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "GardenStore",
    "additionalType": "https://schema.org/LocalBusiness",
    "@id": "https://heatherhillgardens.com/#garden-store",
    "name": "${site.name}",
    "alternateName": "Heather Hill Gardens Farmers Market",
    "description": "Family-owned plant nursery, garden center, and farmers market in Fairfax Station, Virginia specializing in native plants, unusual perennials, hostas, herbs, annuals, and ceramic pots.",
    "url": "${canonicalUrl || 'https://heatherhillgardens.com'}",
    "telephone": "(703) 690-6060",
    "email": "${site.email}",
    "image": "${ogImage || 'https://heatherhillgardens.com/images/og-hero-with-logo.jpg'}",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "8111 Ox Rd",
      "addressLocality": "Fairfax Station",
      "addressRegion": "VA",
      "postalCode": "22039",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 38.7441,
      "longitude": -77.3285
    },
    "areaServed": {
      "@type": "State",
      "name": "Northern Virginia"
    },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "12:00", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "12:00", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "12:00", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:30", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "11:00", "closes": "17:00" }
    ],
    "sameAs": ["${site.facebook}"]
  }
  </script>
</head>
<body>
  ${announcementBar}
  <header class="site-header">
    <div class="header-inner">
      <a href="/" class="logo-link">
        <span class="logo-name">${site.name}</span>
        <span class="logo-tagline">${site.tagline}</span>
      </a>
      <button class="nav-toggle" aria-label="Toggle navigation" onclick="document.querySelector('.nav-links').classList.toggle('open')">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav-links">
        ${navLinks}
      </nav>
    </div>
  </header>

  <main>
    ${content}
  </main>

  <button class="scroll-top" aria-label="Scroll to top" onclick="window.scrollTo({top:0,behavior:'smooth'})">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
  </button>

  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged photo">
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <img class="lightbox-img" id="lightbox-img" src="" alt="">
    <p class="lightbox-caption" id="lightbox-caption"></p>
  </div>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col">
        <h3>${site.name}</h3>
        <p>${site.address}</p>
        <p><a href="${site.googleMapsUrl}" target="_blank" rel="noopener">Get Directions &rarr;</a></p>
        <p><a href="tel:${site.phone.replace(/\./g, "-")}">${site.phone}</a></p>
        <p><a href="mailto:${site.email}">${site.email}</a></p>
      </div>
      <div class="footer-col">
        <h3>Hours</h3>
        <p>${season.hours}</p>
      </div>
      <div class="footer-col">
        <h3>Connect</h3>
        <p><a href="${site.facebook}" target="_blank" rel="noopener">Facebook</a></p>
        <p><a href="mailto:${site.email}?subject=Add Me To Your Mailing List">Join Our Mailing List</a></p>
      </div>
      <div class="footer-bottom">
        <p class="service-areas">${site.serviceAreas}</p>
        <p class="service-areas" style="margin-top:var(--space-sm);">&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
      </div>
    </div>
  </footer>
  <script>
    // Close mobile nav on link click
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
    });
    // Scroll to top button visibility
    (function() {
      var btn = document.querySelector('.scroll-top');
      if (!btn) return;
      window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 400);
      }, {passive: true});
    })();
    // Active category tab on scroll
    (function() {
      var tabs = document.querySelectorAll('.category-tab');
      if (!tabs.length) return;
      var sections = Array.from(tabs).map(function(t) {
        return document.querySelector(t.getAttribute('href'));
      }).filter(Boolean);
      function update() {
        var scrollY = window.scrollY + 120;
        var active = null;
        sections.forEach(function(s, i) {
          if (s.offsetTop <= scrollY) active = i;
        });
        tabs.forEach(function(t, i) {
          t.classList.toggle('active', i === active);
        });
      }
      window.addEventListener('scroll', update, {passive: true});
      update();
    })();
    // Lightbox
    (function() {
      var lb = document.getElementById('lightbox');
      var lbImg = document.getElementById('lightbox-img');
      var lbCap = document.getElementById('lightbox-caption');
      if (!lb) return;
      function open(src, alt) {
        lbImg.src = src;
        lbImg.alt = alt || '';
        lbCap.textContent = alt || '';
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      function close() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
        lbImg.src = '';
      }
      lb.addEventListener('click', function(e) {
        if (e.target === lb || e.target.classList.contains('lightbox-close')) close();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') close();
      });
      // Attach to plant images (not overview/nav images)
      document.querySelectorAll('.gallery-item img, .card-img-wrap img, .variety-row img, .category-intro img').forEach(function(img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          open(img.src, img.alt);
        });
      });
    })();
  </script>
</body>
</html>`;
}

const CSS = `
/* ========================================
   Heather Hill Gardens — The Garden Catalog
   Fraunces + DM Sans · Warm Nursery Palette
   ======================================== */

:root {
  --cream: #FAF6F0;
  --sage: #4A6741;
  --sage-light: #6B8F5E;
  --sage-dark: #2D4028;
  --terracotta: #C17A4E;
  --terracotta-light: #D4956A;
  --bark: #5C4033;
  --moss: #E8E2D4;
  --leaf: #7BA05B;
  --petal: #E8C4A0;
  --white: #FFFFFF;
  --text: #3A3226;
  --text-light: #7A7062;
  --border: #DDD8CE;

  --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-body: 'DM Sans', system-ui, sans-serif;

  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;

  --max-width: 1200px;
  --content-width: 800px;
  --header-height: 72px;
}

/* ---- Reset ---- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font-body);
  color: var(--text);
  background: var(--cream);
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
a, button { -webkit-tap-highlight-color: rgba(74, 103, 65, 0.15); }
/* Paper grain texture */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.038;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
}
img { max-width: 100%; height: auto; display: block; }
a { color: var(--sage); text-decoration: none; transition: color 0.2s; }
a:hover { color: var(--sage-dark); }

/* ---- Animations ---- */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ---- Announcement Bar ---- */
.announcement-bar {
  text-align: center;
  padding: 0.55rem 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--white);
}
.announcement-bar.season-spring { background: var(--sage); }
.announcement-bar.season-fall   { background: var(--terracotta); }
.announcement-bar.season-closed { background: var(--bark); }

/* ---- Header ---- */
.site-header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 200;
  box-shadow: 0 1px 10px rgba(58, 50, 38, 0.07);
}
.header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg);
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  gap: 0.05rem;
}
.logo-name {
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--sage-dark);
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.logo-tagline {
  font-family: var(--font-body);
  font-size: 0.68rem;
  color: var(--text-light);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 400;
}

/* Nav */
.nav-links {
  display: flex;
  gap: var(--space-lg);
  align-items: center;
}
.nav-link {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.02em;
  padding: 0.25rem 0;
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 100%;
  height: 2px;
  background: var(--sage);
  border-radius: 1px;
  transition: right 0.25s ease;
}
.nav-link:hover { color: var(--sage); }
.nav-link:hover::after { right: 0; }
.nav-link.active { color: var(--sage); font-weight: 600; }
.nav-link.active::after { right: 0; background: var(--sage); }

/* Hamburger */
.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}
.nav-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.25s;
}

/* ---- Footer ---- */
.site-footer {
  background: var(--sage-dark);
  color: rgba(255,255,255,0.75);
  margin-top: var(--space-3xl);
}
.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}
.footer-col h3 {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
  color: var(--white);
  letter-spacing: -0.01em;
}
.footer-col p { font-size: 0.875rem; margin-bottom: 0.4rem; line-height: 1.65; }
.footer-col a { color: var(--petal); transition: color 0.2s; }
.footer-col a:hover { color: var(--white); }
.footer-bottom {
  grid-column: 1 / -1;
  border-top: 1px solid rgba(255,255,255,0.12);
  padding-top: var(--space-lg);
  margin-top: var(--space-sm);
}
.service-areas {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.38);
  line-height: 1.7;
}

/* ---- Layout Utilities ---- */
.page-section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
}
.page-section-narrow {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
}

/* ---- Typography ---- */
.page-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--sage-dark);
  line-height: 1.12;
  margin-bottom: var(--space-md);
  letter-spacing: -0.02em;
}
.page-subtitle {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  font-style: italic;
  color: var(--text-light);
  margin-bottom: var(--space-xl);
  line-height: 1.6;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--sage-dark);
  line-height: 1.18;
  margin-bottom: var(--space-md);
  letter-spacing: -0.015em;
}
.section-intro {
  font-size: 1rem;
  color: var(--text-light);
  max-width: 65ch;
  margin-bottom: var(--space-xl);
  line-height: 1.8;
}

/* ---- Hero ---- */
.hero {
  background: var(--moss);
  overflow: hidden;
}
.hero-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-lg);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  align-items: center;
}
.hero-text h1 {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  font-weight: 700;
  color: var(--sage-dark);
  line-height: 1.1;
  margin-bottom: var(--space-lg);
  letter-spacing: -0.025em;
  animation: fadeInUp 0.7s ease both;
}
.hero-text p {
  font-size: 1.05rem;
  color: var(--text);
  line-height: 1.8;
  margin-bottom: var(--space-lg);
  animation: fadeInUp 0.7s ease 0.15s both;
}
.hero-text .btn,
.hero-text .hero-cta {
  animation: fadeInUp 0.7s ease 0.3s both;
}
.hero-images {
  display: grid;
  gap: var(--space-md);
  animation: fadeInUp 0.7s ease 0.2s both;
  /* Allow rotated images to breathe */
  padding: var(--space-md);
}
.hero-images img {
  border-radius: 6px;
  object-fit: cover;
  width: 100%;
  transform: rotate(1.5deg);
  box-shadow: 8px 8px 0 var(--petal);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.hero-images img:nth-child(even) {
  transform: rotate(-1deg);
  box-shadow: -8px 8px 0 var(--petal);
}
.hero-images img:hover {
  transform: rotate(0deg) scale(1.02);
  box-shadow: 0 14px 32px rgba(58, 50, 38, 0.2);
}
.hero-images.single img { max-height: 440px; }
.hero-images.multi { grid-template-columns: 1fr 1fr; }
.hero-images.multi img { height: 300px; }
.hero-images.triple img:first-child {
  grid-column: 1 / -1;
  height: 320px;
}

/* ---- Buttons ---- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.75rem;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s, color 0.15s;
  cursor: pointer;
  border: none;
}
.btn-primary {
  background: var(--sage);
  color: var(--white);
}
.btn-primary:hover {
  background: var(--sage-dark);
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(45, 64, 40, 0.28);
}
.btn-secondary {
  background: var(--terracotta);
  color: var(--white);
}
.btn-secondary:hover {
  background: #a5663e;
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(193, 122, 78, 0.3);
}
/* Legacy alias */
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--sage);
  color: var(--white);
  padding: 0.75rem 1.75rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s, color 0.15s;
}
.hero-cta:hover {
  background: var(--sage-dark);
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(45, 64, 40, 0.28);
}

/* ---- Cards ---- */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
}
.card-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}
.card {
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(58, 50, 38, 0.06);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.card:hover {
  box-shadow: 0 10px 28px rgba(58, 50, 38, 0.12);
  transform: translateY(-3px);
}
.card-img-wrap {
  height: 220px;
  overflow: hidden;
}
.card-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.card:hover .card-img-wrap img {
  transform: scale(1.06);
}
.card-image {
  height: 220px;
  object-fit: cover;
  width: 100%;
}
.card-body {
  padding: var(--space-lg);
}
.card-body h3 {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--sage-dark);
  margin-bottom: var(--space-sm);
  letter-spacing: -0.01em;
}
.card-body p {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.65;
}

/* ---- Plant List ---- */
.plant-list {
  columns: 2;
  column-gap: var(--space-xl);
  list-style: none;
}
.plant-list li {
  padding: 0.4rem 0;
  font-size: 0.95rem;
  break-inside: avoid;
  border-bottom: 1px solid var(--border);
}
.plant-list li:last-child { border-bottom: none; }
.plant-name { font-weight: 500; color: var(--text); }
.plant-variety { color: var(--text-light); font-style: italic; }

/* ---- Gallery ---- */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
}
.gallery-item {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}
.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
}
.gallery-item:hover img { transform: scale(1.06); }
.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(45, 64, 40, 0.82));
  color: var(--white);
  padding: var(--space-lg) var(--space-sm) var(--space-sm);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* ---- Recipe Cards ---- */
.recipe-list { display: grid; gap: var(--space-md); }
.recipe-card {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  background: var(--white);
  border-radius: 12px;
  padding: var(--space-lg);
  border: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(58, 50, 38, 0.05);
  transition: box-shadow 0.3s, transform 0.3s;
}
.recipe-card:hover {
  box-shadow: 0 8px 22px rgba(58, 50, 38, 0.1);
  transform: translateY(-2px);
}
.recipe-info { flex: 1; }
.recipe-info h3 {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--sage-dark);
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
}
.recipe-herbs {
  font-size: 0.82rem;
  color: var(--text-light);
  font-style: italic;
}
.recipe-download {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--sage);
  color: var(--white);
  padding: 0.5rem 1.1rem;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.2s, transform 0.15s;
}
.recipe-download:hover {
  background: var(--sage-dark);
  color: var(--white);
  transform: translateY(-1px);
}

/* ---- Steps ---- */
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
}
.step { text-align: center; padding: var(--space-lg) var(--space-md); }
.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--sage);
  color: var(--white);
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: var(--space-md);
}
.step h3 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--sage-dark);
}
.step p {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.65;
}

/* ---- Info Block ---- */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
}
.info-block h3 {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--sage-dark);
  margin-bottom: var(--space-md);
  letter-spacing: -0.01em;
}
.info-block h3 + h3 { margin-top: var(--space-xl); }
.info-block p {
  margin-bottom: var(--space-sm);
  line-height: 1.75;
  font-size: 0.95rem;
}
.info-block a { color: var(--sage); font-weight: 500; }
.info-block ol {
  padding-left: var(--space-lg);
  line-height: 1.9;
  font-size: 0.95rem;
}

/* ---- Tags ---- */
.tag {
  display: inline-block;
  background: var(--moss);
  color: var(--sage-dark);
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 2px;
}
.tag-native {
  background: #2d6a4f;
  color: #fff;
  font-weight: 600;
}

/* ---- Plants Page: Overview Cards ---- */
.plant-overview {
  margin-bottom: var(--space-2xl);
}
.plant-overview-card {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-xl);
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: var(--space-lg);
  border-radius: 12px;
  transition: background 0.2s, box-shadow 0.2s;
}
.plant-overview-card:hover {
  background: var(--moss);
  box-shadow: 0 4px 16px rgba(58, 50, 38, 0.08);
}
.plant-overview-card figure {
  margin: 0;
}
.plant-overview-card figure img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
  transition: transform 0.4s ease;
}
.plant-overview-card:hover figure img {
  transform: scale(1.03);
}
.plant-overview-card figure figcaption {
  font-size: 0.8rem;
  color: var(--text-light);
  margin-top: var(--space-xs);
  font-style: italic;
  text-align: center;
}
.plant-overview-text h2 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--sage-dark);
  margin-bottom: var(--space-sm);
  letter-spacing: -0.015em;
}
.plant-overview-text p {
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.7;
  margin-bottom: var(--space-sm);
}
.plant-overview-link {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--sage);
  transition: color 0.2s;
}
.plant-overview-card:hover .plant-overview-link {
  color: var(--sage-dark);
}
.overview-divider {
  border: none;
  height: 1px;
  background: var(--border);
  margin: var(--space-sm) 0;
}

/* ---- Plants Page: Category Intro (image + text) ---- */
.category-intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: start;
  margin-bottom: var(--space-xl);
}
.category-intro figure {
  margin: 0;
}
.category-intro figure img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
}
.category-intro .category-intro-text .section-intro {
  max-width: none;
}

/* ---- Perennials Variety Row ---- */
.variety-row {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
  margin-bottom: var(--space-md);
}
.variety-row img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

/* ---- Dividers ---- */
.section-divider {
  border: none;
  height: 1px;
  background: var(--border);
  margin: var(--space-2xl) 0;
}
.divider {
  text-align: center;
  color: var(--text-light);
  font-size: 1rem;
  letter-spacing: 0.4em;
  margin: var(--space-2xl) 0;
  opacity: 0.55;
  user-select: none;
}

/* ---- Category Tabs ---- */
.category-nav {
  display: flex;
  gap: 0;
  flex-wrap: wrap;
  margin-bottom: var(--space-xl);
  border-bottom: 2px solid var(--border);
}
.category-tab {
  padding: 0.6rem 1.1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-light);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
  letter-spacing: 0.01em;
}
.category-tab:hover {
  color: var(--sage);
  border-bottom-color: var(--sage);
}

/* ---- Photo grid ---- */
.photo-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
}
.photo-grid-2 img {
  border-radius: 10px;
  width: 100%;
  height: 300px;
  object-fit: cover;
}

/* ---- CTA Section ---- */
.cta-section {
  background: var(--moss);
  padding: var(--space-2xl) var(--space-lg);
  text-align: center;
}
.cta-section .section-title { margin-bottom: var(--space-md); }
.cta-section .section-intro { margin: 0 auto var(--space-xl); }
.cta-buttons {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* ======== RESPONSIVE ======== */

@media (max-width: 1024px) {
  .card-grid-3 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  :root { --header-height: 64px; }

  .hero-inner {
    grid-template-columns: 1fr;
    padding: var(--space-xl) var(--space-lg);
    gap: var(--space-lg);
  }
  .hero-text h1 { font-size: 2rem; }
  .hero-images {
    padding: var(--space-sm);
  }
  .hero-images img {
    transform: rotate(0.8deg);
    box-shadow: 4px 4px 0 var(--petal);
  }
  .hero-images img:nth-child(even) {
    transform: rotate(-0.5deg);
    box-shadow: -4px 4px 0 var(--petal);
  }
  .hero-images.single img { max-height: 280px; }
  .hero-images.multi { grid-template-columns: 1fr 1fr; }
  .hero-images.multi img { height: 180px; }
  .hero-images.triple img:first-child { height: 200px; }

  .footer-inner { grid-template-columns: 1fr 1fr; gap: var(--space-lg); }
  .info-grid { grid-template-columns: 1fr; }
  .plant-overview-card { grid-template-columns: 1fr; }
  .plant-overview-card figure img { height: 180px; }
  .category-intro { grid-template-columns: 1fr; }
  .plant-list { columns: 1; }
  .page-title { font-size: 2rem; }
  .section-title { font-size: 1.5rem; }
  .card-grid-3 { grid-template-columns: 1fr; }
  .card-img-wrap { height: 180px; }
  .card-image { height: 180px; }
  .photo-grid-2 { grid-template-columns: 1fr; }
  .photo-grid-2 img { height: 220px; }

  .nav-toggle { display: flex; }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    flex-direction: column;
    padding: var(--space-lg);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 8px 28px rgba(58, 50, 38, 0.1);
    gap: 0;
    align-items: stretch;
  }
  .nav-links.open { display: flex; }
  .nav-link {
    padding: 0.75rem var(--space-md);
    border-bottom: 1px solid var(--border);
  }
  .nav-link:last-child { border-bottom: none; }
  .nav-link::after { display: none; }

  .recipe-card {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
}

@media (max-width: 480px) {
  html { font-size: 15px; }
  .hero-text h1 { font-size: 1.75rem; }
  .hero-inner { padding: var(--space-lg) var(--space-md); gap: var(--space-md); }
  .hero-images.single img { max-height: 220px; }
  .hero-images.multi { grid-template-columns: 1fr; }
  .hero-images.multi img { height: 200px; }
  .hero-images.triple img:first-child { height: 180px; }
  .variety-img, .variety-row img { width: 80px !important; height: 80px !important; }
  .page-section,
  .page-section-narrow { padding: var(--space-xl) var(--space-md); }
  .cta-section { padding: var(--space-xl) var(--space-md); }
  .card-grid { grid-template-columns: 1fr; }
  .card-img-wrap { height: 160px; }
  .card-image { height: 160px; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .steps { grid-template-columns: 1fr; }
  .logo-name { font-size: 1.25rem; }
  .footer-inner { grid-template-columns: 1fr; }
  .announcement-bar { font-size: 0.8rem; padding: 0.45rem 0.75rem; }
  .category-nav { gap: 0; overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap; }
  .category-tab { white-space: nowrap; flex-shrink: 0; }
  .about-hero-text p { font-size: 0.95rem; }
}

/* ---- Active Category Tab ---- */
.category-tab.active {
  color: var(--sage);
  border-bottom-color: var(--sage);
  font-weight: 600;
}

/* ---- Scroll to Top ---- */
.scroll-top {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--sage);
  color: var(--white);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(45, 64, 40, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: opacity 0.3s, visibility 0.3s, transform 0.3s, background 0.2s;
  z-index: 100;
}
.scroll-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.scroll-top:hover {
  background: var(--sage-dark);
}
.scroll-top svg {
  width: 20px;
  height: 20px;
}

/* ---- Lightbox ---- */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s, visibility 0.25s;
  cursor: zoom-out;
  padding: 2rem;
}
.lightbox.active {
  opacity: 1;
  visibility: visible;
}
.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: var(--white);
  font-size: 2.5rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.lightbox-close:hover { opacity: 1; }
.lightbox-img {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
}
.lightbox-caption {
  color: var(--white);
  font-size: 0.95rem;
  margin-top: 1rem;
  text-align: center;
  opacity: 0.85;
}

`;

