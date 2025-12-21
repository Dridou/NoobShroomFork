export const SITE_URL = "https://www.noobshroom.com";

export const NO_INDEX_SLUGS = [
  "terms",
  "privacy-policy",
  "source-credit",
  "contact-us",
  "about-us",
  "login",
  "talent-generator",
  "prayer-statue",
  "most-profitable-packs",
  "cross-server-arena",
  "character-attributes",
];

export const isNoIndexSlug = (slug) => NO_INDEX_SLUGS.includes(slug);
