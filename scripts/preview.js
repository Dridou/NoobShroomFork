const fs = require("fs");
const path = require("path");

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
};

const filePath = getArgValue("--file") || process.env.PUBLISH_FILE;
const apiUrl =
  getArgValue("--url") ||
  process.env.PUBLISH_API_URL ||
  "http://localhost:3000/api/admin/publish";
const token = getArgValue("--token") || process.env.PUBLISH_TOKEN;

if (!filePath) {
  console.error("Missing payload file. Usage: node scripts/preview.js --file path/to/payload.json");
  process.exit(1);
}

if (!token) {
  console.error("Missing PUBLISH_TOKEN (or --token).");
  process.exit(1);
}

const payloadPath = path.resolve(process.cwd(), filePath);
const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
payload.preview = true;

const run = async () => {
  const response = await fetch(`${apiUrl}?preview=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  if (!response.ok) {
    console.error(`Preview failed (${response.status}): ${text}`);
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
  console.error("Preview error:", error);
  process.exit(1);
});
