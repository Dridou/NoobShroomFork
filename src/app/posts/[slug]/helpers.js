export const slugifyTitle = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s?]/g, "-")
    .replace(/[^\w-]+/g, "");
};
