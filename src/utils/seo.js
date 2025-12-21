export const SITE_URL = "https://www.noobshroom.com";
export const SITE_NAME = "NoobShroom";
export const DEFAULT_TITLE = "Legend of Mushroom - Wiki";
export const DEFAULT_DESCRIPTION =
  "Your ultimate guide to the Legend of Mushroom game";
export const ADSENSE_PUBLISHER_ID = "ca-pub-3853373332492086";

export const NO_INDEX_SLUGS = [
  "login",
  "talent-generator",
  "prayer-statue",
  "most-profitable-packs",
  "cross-server-arena",
  "character-attributes",
];

export const isNoIndexSlug = (slug) => NO_INDEX_SLUGS.includes(slug);

export const NO_INDEX_PATHS = ["/login", "/write"];

export const isNoIndexPath = (path) => NO_INDEX_PATHS.includes(path);
