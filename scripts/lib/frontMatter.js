const parseYamlValue = (value) => {
  if (value === "null") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    const unquoted = value.slice(1, -1);
    return unquoted.replace(/\\"/g, "\"");
  }
  return value;
};

const parseFrontMatter = (input) => {
  const text = (input || "").replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) {
    return { data: {}, body: input || "" };
  }

  const endIndex = text.indexOf("\n---", 4);
  if (endIndex === -1) {
    return { data: {}, body: input || "" };
  }

  const raw = text.slice(4, endIndex).trim();
  const body = text.slice(endIndex + 4).replace(/^\n/, "");
  const data = {};

  if (raw.length > 0) {
    raw.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const separatorIndex = trimmed.indexOf(":");
      if (separatorIndex === -1) return;
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      data[key] = parseYamlValue(value);
    });
  }

  return { data, body };
};

module.exports = {
  parseFrontMatter,
};
