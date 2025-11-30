const DEFAULT_DOMAIN = "https://www.noobshroom.com";

const previewDomain = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return DEFAULT_DOMAIN;
};

export const getBaseUrl = () => {
  if (process.env.VERCEL_ENV === "production") {
    return DEFAULT_DOMAIN;
  }

  if (process.env.VERCEL_ENV === "preview") {
    return previewDomain();
  }

  return "http://localhost:3000";
};
