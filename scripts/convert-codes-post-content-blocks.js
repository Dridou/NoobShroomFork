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

const extractTagHtml = (html, tag) => {
  const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
  return html.match(regex) || [];
};

const extractFirstTagHtml = (html, tag) => {
  const matches = extractTagHtml(html, tag);
  return matches.length ? matches[0] : null;
};

const extractListItems = (html, tag) => {
  const listHtml = extractFirstTagHtml(html, tag);
  if (!listHtml) return [];
  const liMatches = listHtml.match(/<li>[\s\S]*?<\/li>/gi) || [];
  return liMatches.map((item) => stripTags(item));
};

const extractHeadingText = (html, index = 0) => {
  const headings = extractTagHtml(html, "h3").map(stripTags);
  return headings[index] || null;
};

const extractCustomRowHtml = (html) => {
  const match = html.match(
    /<div[^>]*class=\"[^\"]*custom-row[^\"]*\"[^>]*>[\s\S]*?<\/div>/i
  );
  return match ? match[0].trim() : null;
};

const extractSourcesHtml = (html) => {
  const match = html.match(/<p>Sources:[\s\S]*?<\/p>/i);
  return match ? match[0].trim() : null;
};

loadEnv(path.join(process.cwd(), ".env.local"));
loadEnv(path.join(process.cwd(), ".env"));

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const postId = process.argv[2] || "clzplpn3a0000xvcg8mh8t0zk";
const ACTIVE_SECTION_ID = "clzpm28400005uz3y64ex6urq";
const REDEEM_SECTION_ID = "clzpm282y0003uz3ysc4uxvtj";
const RELEASE_SECTION_ID = "cmjhzwn3v0005pa7z0pn3yu8f";

(async () => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { sections: { orderBy: { displayOrder: "asc" } } },
  });

  if (!post) {
    console.log("Post not found");
    return;
  }

  const sectionsById = Object.fromEntries(
    post.sections.map((section) => [section.id, section])
  );

  const activeSection = sectionsById[ACTIVE_SECTION_ID];
  const redeemSection = sectionsById[REDEEM_SECTION_ID];
  const releaseSection = sectionsById[RELEASE_SECTION_ID];

  if (!activeSection || !redeemSection || !releaseSection) {
    console.log("Expected sections not found for this post.");
    return;
  }

  const activeParagraphs = extractTagHtml(activeSection.content, "p");
    const activeBlocks = [
    activeParagraphs[0]
      ? { type: "html", html: activeParagraphs[0].trim() }
      : null,
    activeParagraphs[1]
      ? { type: "paragraph", text: stripTags(activeParagraphs[1]) }
      : null,
    {
      type: "list",
      items: extractListItems(activeSection.content, "ul"),
      ordered: false,
    },
    extractSourcesHtml(activeSection.content)
      ? { type: "html", html: extractSourcesHtml(activeSection.content) }
      : null,
  ].filter(Boolean);

  const redeemParagraphs = extractTagHtml(redeemSection.content, "p");
  const redeemBlocks = [
    redeemParagraphs[0]
      ? { type: "paragraph", text: stripTags(redeemParagraphs[0]) }
      : null,
    extractCustomRowHtml(redeemSection.content)
      ? { type: "html", html: extractCustomRowHtml(redeemSection.content) }
      : null,
    {
      type: "heading",
      level: 3,
      text: extractHeadingText(redeemSection.content, 0) || "Steps",
    },
    {
      type: "list",
      items: extractListItems(redeemSection.content, "ol"),
      ordered: true,
    },
    {
      type: "heading",
      level: 3,
      text: extractHeadingText(redeemSection.content, 1) || "Troubleshooting",
    },
    {
      type: "list",
      items: extractListItems(redeemSection.content, "ul"),
      ordered: false,
    },
    redeemParagraphs[1]
      ? { type: "paragraph", text: stripTags(redeemParagraphs[1]) }
      : null,
  ].filter(Boolean);

  const releaseParagraphs = extractTagHtml(releaseSection.content, "p");
    const releaseBlocks = [
    ...releaseParagraphs.map((paragraph) => ({
      type: "paragraph",
      text: stripTags(paragraph),
    })),
    {
      type: "list",
      items: extractListItems(releaseSection.content, "ul"),
      ordered: false,
    },
  ].filter(Boolean);

  const updates = [
    { id: activeSection.id, contentBlocks: activeBlocks },
    { id: redeemSection.id, contentBlocks: redeemBlocks },
    { id: releaseSection.id, contentBlocks: releaseBlocks },
  ];

  for (const update of updates) {
    await prisma.section.update({
      where: { id: update.id },
      data: { contentBlocks: update.contentBlocks },
    });
  }

  console.log("Updated sections:", updates.map((update) => update.id));
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

