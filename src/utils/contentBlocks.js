const toTrimmedString = (value) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
};

const normalizeListItems = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map((item) => toTrimmedString(item))
    .filter((item) => item.length > 0);
};

const normalizeBlock = (block) => {
  if (!block || typeof block !== "object") {
    return null;
  }

  const type = toTrimmedString(block.type).toLowerCase();

  if (type === "paragraph") {
    const text = toTrimmedString(block.text);
    return text ? { type, text } : null;
  }

  if (type === "heading") {
    const text = toTrimmedString(block.text);
    if (!text) {
      return null;
    }
    const level = Number(block.level) || 2;
    const safeLevel = Math.min(6, Math.max(2, level));
    return { type, text, level: safeLevel };
  }

  if (type === "list") {
    const items = normalizeListItems(block.items);
    if (items.length === 0) {
      return null;
    }
    return { type, items, ordered: Boolean(block.ordered) };
  }

  if (type === "html") {
    const html = toTrimmedString(block.html);
    return html ? { type, html } : null;
  }

  return null;
};

export const normalizeContentBlocks = (blocks) => {
  if (!Array.isArray(blocks)) {
    return null;
  }

  const normalized = blocks
    .map((block) => normalizeBlock(block))
    .filter((block) => block !== null);

  return normalized;
};

