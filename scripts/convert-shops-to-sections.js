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

if (!target) {
  console.log(
    "Usage: node scripts/convert-shops-to-sections.js <postId|slug> [--overwrite]"
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

  const shops = await prisma.shop.findMany({
    where: { postId: post.id },
    orderBy: { displayOrder: "asc" },
    include: { section: true },
  });

  const summary = {
    created: 0,
    updated: 0,
    skipped: 0,
  };

  for (const shop of shops) {
    if (shop.section && !overwrite) {
      summary.skipped += 1;
      continue;
    }

    const content = shop.desc || "";
    const contentBlocks = htmlToMarkdownBlocks(content);
    const sectionData = {
      title: shop.title,
      content,
      contentBlocks,
      postId: post.id,
      displayOrder: shop.displayOrder,
      type: "shop",
    };

    let sectionId = shop.sectionId;

    if (shop.section) {
      await prisma.section.update({
        where: { id: shop.section.id },
        data: sectionData,
      });
      sectionId = shop.section.id;
      summary.updated += 1;
    } else {
      const created = await prisma.section.create({
        data: sectionData,
      });
      sectionId = created.id;
      summary.created += 1;
    }

    if (sectionId && shop.sectionId !== sectionId) {
      await prisma.shop.update({
        where: { id: shop.id },
        data: { sectionId },
      });
    }
  }

  console.log(
    `Post ${post.slug} (${post.id}) -> created ${summary.created}, updated ${summary.updated}, skipped ${summary.skipped}`
  );
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
