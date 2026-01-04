const fs = require("fs");
const path = require("path");

const loadEnv = (file) => {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    if (!key) continue;
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
};

const stripTags = (html) =>
  html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

const stripSectionTags = (html) => html.replace(/<\/?section[^>]*>/gi, "");

const extractLooseListItems = (html) => {
  const parts = html.split(/<li[^>]*>/gi).slice(1);
  const items = parts
    .map((part) =>
      stripTags(part.split(/<\/li>/i)[0].replace(/<\/(ul|ol)>/i, ""))
    )
    .filter((item) => item.length > 0);
  const hasInlineTags = /<[^>]+>/.test(html.replace(/<\/?li[^>]*>/gi, ""));
  return { items, hasInlineTags };
};

const blockTagRegex = /<(p|ul|ol|h[1-6]|table|div)\b[^>]*>/gi;

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

const htmlToBlocks = (input) => {
  if (typeof input !== "string" || input.trim().length === 0) {
    return [];
  }

  const html = stripSectionTags(input);
  const blocks = [];
  let cursor = 0;

  while (true) {
    const next = findNextBlock(html, cursor);
    if (!next) break;

    const tag = next.tag;
    const openTag = next.open;
    const contentStart = next.index + openTag.length;
    const closingTag = `</${tag}>`;
    const closingIndex = html.indexOf(closingTag, contentStart);
    const following = findNextBlock(html, contentStart);
    const nextIndex = following ? following.index : -1;
    const contentEnd =
      closingIndex !== -1 && (nextIndex === -1 || closingIndex < nextIndex)
        ? closingIndex
        : nextIndex;

    if (tag === "table" || tag === "div") {
      const chunk = sliceUntil(html, next.index, closingIndex, closingTag);
      if (chunk.trim()) {
        blocks.push({ type: "html", html: chunk.trim() });
      }
      cursor =
        closingIndex !== -1 ? closingIndex + closingTag.length : contentStart;
      continue;
    }

    if (tag.startsWith("h")) {
      const chunk = sliceUntil(html, contentStart, contentEnd, closingTag);
      const text = stripTags(chunk);
      if (text) {
        const level = Number(tag.slice(1)) || 2;
        const safeLevel = Math.min(6, Math.max(2, level));
        blocks.push({ type: "heading", level: safeLevel, text });
      }
      cursor = contentEnd !== -1 ? contentEnd : contentStart;
      continue;
    }

    if (tag === "p") {
      const chunk = sliceUntil(html, contentStart, contentEnd, closingTag);
      const hasInlineTags = /<[^>]+>/.test(chunk);
      if (chunk.trim()) {
        if (hasInlineTags) {
          blocks.push({ type: "html", html: `<p>${chunk.trim()}</p>` });
        } else {
          const text = stripTags(chunk);
          if (text) {
            blocks.push({ type: "paragraph", text });
          }
        }
      }
      cursor = contentEnd !== -1 ? contentEnd : contentStart;
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      const chunk = sliceUntil(html, contentStart, contentEnd, closingTag);
      const { items, hasInlineTags } = extractLooseListItems(chunk);
      if (hasInlineTags || items.length === 0) {
        blocks.push({ type: "html", html: `<${tag}>${chunk}</${tag}>` });
      } else {
        blocks.push({ type: "list", items, ordered: tag === "ol" });
      }
      cursor = contentEnd !== -1 ? contentEnd : contentStart;
      continue;
    }

    cursor = contentStart;
  }

  return blocks;
};

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith("--"));
const overwrite = args.includes("--overwrite");
const dryRun = args.includes("--dry-run");

if (!target) {
  console.log(
    "Usage: node scripts/convert-sections-to-content-blocks.js <postId|slug> [--overwrite] [--dry-run]"
  );
  process.exit(0);
}

loadEnv(path.join(process.cwd(), ".env.local"));
loadEnv(path.join(process.cwd(), ".env"));

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  let post = await prisma.post.findUnique({
    where: { id: target },
    select: { id: true, slug: true },
  });

  if (!post) {
    post = await prisma.post.findUnique({
      where: { slug: target },
      select: { id: true, slug: true },
    });
  }

  if (!post) {
    console.log("Post not found for target:", target);
    return;
  }

  const sections = await prisma.section.findMany({
    where: { postId: post.id },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      title: true,
      content: true,
      contentBlocks: true,
    },
  });

  const summary = {
    converted: 0,
    skipped: 0,
    empty: 0,
  };

  for (const section of sections) {
    const hasBlocks =
      Array.isArray(section.contentBlocks) &&
      section.contentBlocks.length > 0;

    if (hasBlocks && !overwrite) {
      summary.skipped += 1;
      continue;
    }

    const blocks = htmlToBlocks(section.content);
    if (blocks.length === 0) {
      summary.empty += 1;
      continue;
    }

    if (dryRun) {
      console.log(`${section.title}: ${blocks.length} blocks`);
      summary.converted += 1;
      continue;
    }

    await prisma.section.update({
      where: { id: section.id },
      data: { contentBlocks: blocks },
    });

    summary.converted += 1;
  }

  console.log(
    `Post ${post.slug} (${post.id}) -> converted ${summary.converted}, skipped ${summary.skipped}, empty ${summary.empty}`
  );
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });