const fs = require("fs");
const path = require("path");
const { htmlToMarkdownBlocks } = require("./lib/markdownBlocks");

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

    const blocks = htmlToMarkdownBlocks(section.content);
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
