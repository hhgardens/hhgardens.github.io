export interface SiteData {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
  facebook: string;
  gaId: string;
  googleSiteVerification: string;
  serviceAreas: string;
  metaKeywords: string;
  metaDescription: string;
}

export interface SeasonPreset {
  heroHeadline: string;
  heroBody: string;
  heroBodyExtra: string | null;
  ctaText: string;
  ctaHref: string;
  heroImages: { src: string; alt: string }[];
  hours: string;
  announcement: string | null;
}

export interface SeasonsData {
  activeSeason: string;
  presets: Record<string, SeasonPreset>;
}

export interface PlantVariety {
  name: string;
  trademark?: string | null;
  description: string | null;
  image?: string;
}

export interface Plant {
  name: string;
  variety?: string | null;
  description?: string;
  tags?: string[];
  varieties?: PlantVariety[];
  image?: string;
}

export interface HostaGalleryItem {
  src: string;
  name: string;
}

export interface PlantCategory {
  id: string;
  name: string;
  description: string;
  whyUseThem?: string;
  pageIntro?: string;
  additionalInfo?: string;
  overviewDescription?: string;
  closingText?: string;
  image?: string;
  imageCaption?: string;
  specialNotes?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plants: any[];
  featured?: Plant[];
  gallery?: HostaGalleryItem[];
  featuredImages?: { src: string; alt: string; caption: string }[];
}

export interface PlantsData {
  intro: string;
  categories: PlantCategory[];
}

export interface Recipe {
  name: string;
  herbs: string[];
  pdf: string;
}

export interface RecipesData {
  intro: string;
  recipes: Recipe[];
}

export interface PageContext {
  site: SiteData;
  season: SeasonPreset;
  seasons: SeasonsData;
  plants: PlantsData;
  recipes: RecipesData;
}
