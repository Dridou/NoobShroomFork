const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { blocksToMarkdown, htmlToMarkdownString } = require("./lib/markdownBlocks");

const loadEnv = (file) => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, "utf8");
  content
    .split("\n")
    .filter((line) => line && !line.trim().startsWith("#"))
    .forEach((line) => {
      const index = line.indexOf("=");
      if (index === -1) return;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
};

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
};

const slugifyFileName = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "section";

const toIso = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const formatYamlValue = (value) => {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  const text = String(value);
  if (/[:#\n]/.test(text) || text.includes("\"")) {
    return `"${text.replace(/\"/g, '\\"')}"`;
  }
  return text;
};

const buildFrontMatter = (data) => {
  const lines = ["---"];
  data.forEach(([key, value]) => {
    lines.push(`${key}: ${formatYamlValue(value)}`);
  });
  lines.push("---", "");
  return lines.join("\n");
};

const detectFormatAndBody = (section) => {
  const blocks = Array.isArray(section.contentBlocks)
    ? section.contentBlocks
    : [];

  if (blocks.length > 0) {
    const htmlOnly = blocks.every(
      (block) => block && typeof block === "object" && block.type === "html"
    );
    if (htmlOnly) {
      const htmlBody = blocks
        .map((block) => (block.html || "").trim())
        .filter(Boolean)
        .join("\n\n");
      return { format: "html", body: htmlBody };
    }

    const markdown = blocksToMarkdown(blocks);
    if (markdown) {
      return { format: "markdown", body: markdown };
    }
  }

  const html = (section.content || "").trim();
  if (!html) {
    return { format: "markdown", body: "" };
  }

  const markdown = htmlToMarkdownString(html);
  if (markdown) {
    return { format: "markdown", body: markdown };
  }

  return { format: "html", body: html };
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith("--"));
const outputRoot =
  getArgValue("--output") || path.join("content", "posts");
const overwrite = args.includes("--overwrite");
const dryRun = args.includes("--dry-run");
const includeAll = args.includes("--all") || !target;

if (!includeAll && !target) {
  console.error("Missing post slug. Usage: node scripts/export-posts-to-files.js <slug> [--output dir]");
  process.exit(1);
}

loadEnv(path.resolve(process.cwd(), ".env.local"));
loadEnv(path.resolve(process.cwd(), ".env"));

const prisma = new PrismaClient();

const run = async () => {
  const where = includeAll ? {} : { slug: target };
  const posts = await prisma.post.findMany({
    where,
    include: {
      sections: true,
    },
    orderBy: { slug: "asc" },
  });

  if (!includeAll && posts.length === 0) {
    console.error(`Post not found for slug: ${target}`);
    process.exit(1);
  }

  const summary = {
    posts: posts.length,
    sections: 0,
    skipped: 0,
  };

  posts.forEach((post) => {
    const postDir = path.join(outputRoot, post.slug);
    const sectionsDir = path.join(postDir, "sections");

    if (!dryRun) {
      ensureDir(sectionsDir);
    }

    const postPayload = {
      slug: post.slug,
      title: post.title,
      desc: post.desc,
      img: post.img || null,
      imgBig: post.imgBig || null,
      createdAt: toIso(post.createdAt),
      updatedAt: toIso(post.updatedAt),
    };

    const postPath = path.join(postDir, "post.json");
    if (!dryRun) {
      fs.writeFileSync(postPath, JSON.stringify(postPayload, null, 2));
    }

    const sections = [...post.sections].sort((a, b) => {
      const orderA = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return (a.title || "").localeCompare(b.title || "");
    });

    sections.forEach((section, index) => {
      const order = section.displayOrder ?? index + 1;
      const orderPrefix = String(order).padStart(2, "0");
      const fileName = `${orderPrefix}-${slugifyFileName(section.title)}.md`;
      const filePath = path.join(sectionsDir, fileName);

      if (fs.existsSync(filePath) && !overwrite) {
        summary.skipped += 1;
        return;
      }

      const { format, body } = detectFormatAndBody(section);

      const frontMatter = buildFrontMatter([
        ["id", section.id],
        ["title", section.title],
        ["order", order],
        ["type", section.type || "text"],
        ["format", format],
        ["icon", section.icon || null],
        ["createdAt", toIso(section.createdAt)],
        ["updatedAt", toIso(section.updatedAt)],
      ]);

      const payload = `${frontMatter}${body}`.trimEnd() + "\n";

      if (!dryRun) {
        fs.writeFileSync(filePath, payload);
      }
      summary.sections += 1;
    });
  });

  console.log(
    JSON.stringify(
      {
        outputRoot,
        dryRun,
        overwrite,
        ...summary,
      },
      null,
      2
    )
  );
};

run()
  .catch((error) => {
    console.error("Export error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
