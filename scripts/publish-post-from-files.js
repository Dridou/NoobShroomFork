const fs = require("fs");
const path = require("path");
const { parseFrontMatter } = require("./lib/frontMatter");

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
};

const toIso = (value, fallback) => {
  const resolved = value || fallback;
  if (!resolved) return null;
  const date = new Date(resolved);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const readJson = (filePath) =>
  JSON.parse(fs.readFileSync(filePath, "utf8"));

const getSectionOrder = (fileName) => {
  const match = fileName.match(/^(\d+)-/);
  if (!match) return null;
  return Number(match[1]);
};

const run = async () => {
  const slug = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const dirArg = getArgValue("--dir");
  const apiUrl =
    getArgValue("--url") ||
    process.env.PUBLISH_API_URL ||
    "http://localhost:3000/api/admin/publish";
  const token = getArgValue("--token") || process.env.PUBLISH_TOKEN;
  const preview = process.argv.includes("--preview");
  const dryRun = process.argv.includes("--dry-run");

  if (!token) {
    console.error("Missing PUBLISH_TOKEN (or --token)." );
    process.exit(1);
  }

  const postDir = dirArg
    ? path.resolve(process.cwd(), dirArg)
    : path.resolve(process.cwd(), "content", "posts", slug || "");

  if (!fs.existsSync(postDir)) {
    console.error(`Post directory not found: ${postDir}`);
    process.exit(1);
  }

  const postPath = path.join(postDir, "post.json");
  if (!fs.existsSync(postPath)) {
    console.error(`Missing post.json at ${postPath}`);
    process.exit(1);
  }

  const post = readJson(postPath);
  if (!post.slug) {
    console.error("post.json must include slug");
    process.exit(1);
  }

  const sectionsDir = path.join(postDir, "sections");
  const sectionFiles = fs.existsSync(sectionsDir)
    ? fs.readdirSync(sectionsDir).filter((file) => file.endsWith(".md"))
    : [];

  const nowIso = new Date().toISOString();

  const sections = sectionFiles
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => {
      const orderFromName = getSectionOrder(fileName);
      if (!orderFromName) {
        throw new Error(`Section file missing order prefix: ${fileName}`);
      }

      const filePath = path.join(sectionsDir, fileName);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, body } = parseFrontMatter(raw);

      if (data.order && Number(data.order) !== orderFromName) {
        throw new Error(
          `Order mismatch in ${fileName}: filename ${orderFromName} vs front matter ${data.order}`
        );
      }

      const title = data.title || path.basename(fileName, ".md");
      if (!title) {
        throw new Error(`Missing title in ${fileName}`);
      }

      const format = data.format || "markdown";
      const trimmedBody = body.trim();
      const hasBody = trimmedBody.length > 0;

      const contentBlocks = hasBody
        ? format === "html"
          ? [{ type: "html", html: trimmedBody }]
          : [{ type: "markdown", text: trimmedBody }]
        : [];

      return {
        id: data.id || undefined,
        title,
        content: format === "html" && hasBody ? trimmedBody : undefined,
        contentBlocks,
        icon: data.icon || undefined,
        type: data.type || "text",
        displayOrder: orderFromName,
        postSlug: post.slug,
        createdAt: toIso(data.createdAt, nowIso),
        updatedAt: toIso(data.updatedAt, nowIso),
      };
    });

  const payload = {
    post: {
      slug: post.slug,
      title: post.title,
      desc: post.desc,
      img: post.img,
      imgBig: post.imgBig,
      createdAt: toIso(post.createdAt, nowIso),
      updatedAt: toIso(post.updatedAt, nowIso),
      catSlug: post.catSlug,
      catTitle: post.catTitle,
      catImg: post.catImg,
      userEmail: post.userEmail,
      metadata: post.metadata,
    },
    sections,
  };

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const response = await fetch(`${apiUrl}${preview ? "?preview=true" : ""}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...payload, preview }),
  });

  const text = await response.text();
  if (!response.ok) {
    console.error(`Publish failed (${response.status}): ${text}`);
    process.exit(1);
  }

  try {
    const json = JSON.parse(text);
    console.log(JSON.stringify(json, null, 2));
  } catch (error) {
    console.log(text);
  }
};

run().catch((error) => {
  console.error("Publish error:", error);
  process.exit(1);
});

