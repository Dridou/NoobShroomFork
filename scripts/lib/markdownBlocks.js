const decodeEntities = (text) =>
  text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

const getAttr = (tag, name) => {
  const regex = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = tag.match(regex);
  if (!match) return "";
  return (match[2] || match[3] || match[4] || "").trim();
};

const inlineHtmlToMarkdown = (input) => {
  if (!input) return "";
  let text = input.replace(/\r/g, "");

  text = text.replace(/<br\s*\/?>/gi, "\n");

  text = text.replace(
    /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, inner) => {
      const label = inlineHtmlToMarkdown(inner);
      return label ? `[${label}](${href})` : href;
    }
  );

  text = text.replace(
    /<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi,
    (_, __, inner) => {
      const label = inlineHtmlToMarkdown(inner);
      return label ? `**${label}**` : "";
    }
  );

  text = text.replace(
    /<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi,
    (_, __, inner) => {
      const label = inlineHtmlToMarkdown(inner);
      return label ? `*${label}*` : "";
    }
  );

  text = text.replace(
    /<u[^>]*>([\s\S]*?)<\/u>/gi,
    (_, inner) => {
      const label = inlineHtmlToMarkdown(inner);
      return label ? `++${label}++` : "";
    }
  );
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, inner) => {
    const label = inlineHtmlToMarkdown(inner);
    return label ? `\`${label}\`` : "";
  });

  text = text.replace(/<img\b[^>]*>/gi, (match) => {
    const src = getAttr(match, "src");
    if (!src) return "";
    const alt = getAttr(match, "alt");
    return `![${alt}](${src})`;
  });

  text = text.replace(/<[^>]*>/g, "");
  text = decodeEntities(text);
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n\s+/g, "\n");
  return text.trim();
};

const stripContainerTags = (html) =>
  html.replace(/<\/?section[^>]*>/gi, "").replace(/<\/?div[^>]*>/gi, "");

const blockTagRegex = /<(p|ul|ol|h[1-6]|table)\b[^>]*>/gi;

const findNextBlock = (html, startIndex) => {
  blockTagRegex.lastIndex = startIndex;
  const match = blockTagRegex.exec(html);
  if (!match) return null;
  return {
    tag: match[1].toLowerCase(),
    index: match.index,
    open: match[0],
  };
};

const sliceUntil = (html, startIndex, endIndex, closingTag) => {
  if (endIndex === -1 || endIndex < startIndex) {
    return html.slice(startIndex);
  }
  if (
    closingTag &&
    html.slice(endIndex, endIndex + closingTag.length) === closingTag
  ) {
    return html.slice(startIndex, endIndex + closingTag.length);
  }
  return html.slice(startIndex, endIndex);
};

const tableToMarkdown = (tableHtml) => {
  const rows = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  if (rows.length === 0) return "";

  const parsedRows = rows.map((row) => {
    const cells =
      row.match(/<(th|td)[^>]*>[\s\S]*?<\/(th|td)>/gi) || [];
    return cells.map((cell) => inlineHtmlToMarkdown(cell));
  });

  const columnCount = Math.max(
    1,
    ...parsedRows.map((row) => row.length)
  );
  const normalize = (row) =>
    row.concat(Array(columnCount - row.length).fill(""));

  const header = normalize(parsedRows[0]);
  const separator = header.map(() => "---");
  const body = parsedRows.slice(1).map((row) => normalize(row));

  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
    ...body.map((row) => `| ${row.join(" | ")} |`),
  ];

  return lines.join("\n");
};

const extractListItems = (html) => {
  const parts = html.split(/<li[^>]*>/gi).slice(1);
  return parts
    .map((part) =>
      part.split(/<\/li>/i)[0].replace(/<\/(ul|ol)>/i, "")
    )
    .map((item) => inlineHtmlToMarkdown(item))
    .filter((item) => item.length > 0);
};

const htmlToMarkdownBlocks = (input) => {
  if (typeof input !== "string" || input.trim().length === 0) {
    return [];
  }

  const html = stripContainerTags(input);
  const blocks = [];
  let cursor = 0;

  while (true) {
    const next = findNextBlock(html, cursor);
    if (!next) break;

    const gap = inlineHtmlToMarkdown(html.slice(cursor, next.index));
    if (gap) {
      blocks.push({ type: "paragraph", text: gap });
    }

    const tag = next.tag;
    const openTag = next.open;
    const contentStart = next.index + openTag.length;
    const closingTag = `</${tag}>`;
    const closingIndex = html.indexOf(closingTag, contentStart);
    const following = findNextBlock(html, contentStart);
    const nextIndex = following ? following.index : -1;
    const safeNextIndex = nextIndex === -1 ? html.length : nextIndex;
    const contentEnd =
      closingIndex !== -1 && closingIndex < safeNextIndex
        ? closingIndex
        : safeNextIndex;

    if (tag === "table") {
      const chunk = sliceUntil(html, next.index, closingIndex, closingTag);
      const markdown = tableToMarkdown(chunk);
      if (markdown) {
        blocks.push({ type: "markdown", text: markdown });
      }
      const afterBlock =
        closingIndex !== -1 ? closingIndex + closingTag.length : safeNextIndex;
      cursor = afterBlock;
      continue;
    }

    if (tag.startsWith("h")) {
      const chunk = sliceUntil(html, contentStart, contentEnd, closingTag);
      const text = inlineHtmlToMarkdown(chunk);
      if (text) {
        const level = Number(tag.slice(1)) || 2;
        const safeLevel = Math.min(6, Math.max(2, level));
        blocks.push({ type: "heading", level: safeLevel, text });
      }
      const afterBlock =
        closingIndex !== -1 ? closingIndex + closingTag.length : safeNextIndex;
      cursor = afterBlock;
      continue;
    }

    if (tag === "p") {
      const chunk = sliceUntil(html, contentStart, contentEnd, closingTag);
      const text = inlineHtmlToMarkdown(chunk);
      if (text) {
        blocks.push({ type: "paragraph", text });
      }
      const afterBlock =
        closingIndex !== -1 ? closingIndex + closingTag.length : safeNextIndex;
      cursor = afterBlock;
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      const chunk = sliceUntil(html, contentStart, contentEnd, closingTag);
      const items = extractListItems(chunk);
      if (items.length > 0) {
        blocks.push({ type: "list", items, ordered: tag === "ol" });
      }
      const afterBlock =
        closingIndex !== -1 ? closingIndex + closingTag.length : safeNextIndex;
      cursor = afterBlock;
      continue;
    }

    cursor = contentStart;
  }

  const trailing = inlineHtmlToMarkdown(html.slice(cursor));
  if (trailing) {
    blocks.push({ type: "paragraph", text: trailing });
  }

  return blocks;
};

const blocksToMarkdown = (blocks) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "";
  }

  const parts = [];

  blocks.forEach((block) => {
    if (!block || typeof block !== "object") {
      return;
    }

    switch (block.type) {
      case "heading": {
        const level = Number(block.level) || 2;
        const safeLevel = Math.min(6, Math.max(2, level));
        const text = (block.text || "").trim();
        if (text) {
          parts.push(`${"#".repeat(safeLevel)} ${text}`);
        }
        return;
      }
      case "paragraph": {
        const text = (block.text || "").trim();
        if (text) {
          parts.push(text);
        }
        return;
      }
      case "list": {
        const items = Array.isArray(block.items) ? block.items : [];
        const prefix = block.ordered ? "1." : "-";
        const lines = items
          .map((item) => (item || "").trim())
          .filter(Boolean)
          .map((item) => `${prefix} ${item}`);
        if (lines.length > 0) {
          parts.push(lines.join("\n"));
        }
        return;
      }
      case "markdown": {
        const text = (block.text || "").trim();
        if (text) {
          parts.push(text);
        }
        return;
      }
      case "html": {
        const html = (block.html || "").trim();
        if (!html) {
          return;
        }
        const markdown = htmlToMarkdownString(html);
        if (markdown) {
          parts.push(markdown);
        } else {
          parts.push(html);
        }
        return;
      }
      default:
        return;
    }
  });

  return parts.join("\n\n").trim();
};

const htmlToMarkdownString = (input) => {
  const blocks = htmlToMarkdownBlocks(input);
  return blocksToMarkdown(blocks);
};

module.exports = {
  htmlToMarkdownBlocks,
  htmlToMarkdownString,
  inlineHtmlToMarkdown,
  blocksToMarkdown,
};





