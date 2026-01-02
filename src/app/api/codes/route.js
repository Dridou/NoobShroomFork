import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const LOG_PREFIX = "[codes-api]";
const CODE_PATTERN = /gift\s*code\s*[:\-]\s*([A-Za-z0-9_-]+)/gi;
const DATE_PATTERN = /valid\s*until\s*([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/i;

const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch (err) {
    return "[unserializable]";
  }
};

const logInfo = (message, data) => {
  if (data === undefined) {
    console.log(`${LOG_PREFIX} ${message}`);
    return;
  }
  console.log(`${LOG_PREFIX} ${message} ${safeStringify(data)}`);
};

const logWarn = (message, data) => {
  if (data === undefined) {
    console.warn(`${LOG_PREFIX} ${message}`);
    return;
  }
  console.warn(`${LOG_PREFIX} ${message} ${safeStringify(data)}`);
};

const logError = (message, data) => {
  if (data === undefined) {
    console.error(`${LOG_PREFIX} ${message}`);
    return;
  }
  console.error(`${LOG_PREFIX} ${message} ${safeStringify(data)}`);
};

const describePayload = (payload) => {
  if (payload === null) {
    return { type: "null" };
  }
  if (payload === undefined) {
    return { type: "undefined" };
  }
  if (Array.isArray(payload)) {
    return {
      type: "array",
      length: payload.length,
      sampleKeys:
        payload[0] && typeof payload[0] === "object"
          ? Object.keys(payload[0])
          : [],
    };
  }
  if (typeof payload === "object") {
    return {
      type: "object",
      keys: Object.keys(payload),
    };
  }
  const preview = String(payload).slice(0, 160);
  return { type: typeof payload, preview };
};

const normalizeCode = (value) => value.trim().toUpperCase();

const parseMmDdYyyy = (value) => {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) {
    return null;
  }
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

const parseExpiredOn = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const mmdd = parseMmDdYyyy(trimmed);
  if (mmdd) {
    return mmdd;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const normalizeMessagePayload = (message) => {
  const payload =
    message?.json && typeof message.json === "object" ? message.json : message;
  const content = typeof payload?.content === "string" ? payload.content : "";
  const id = payload?.id ? String(payload.id) : undefined;
  return { content, id };
};

const extractCodesFromMessage = (message) => {
  const { content, id } = normalizeMessagePayload(message);

  if (!content) {
    return [];
  }

  const dateMatch = content.match(DATE_PATTERN);
  const expiredOn = dateMatch ? parseMmDdYyyy(dateMatch[1]) : null;
  const results = [];

  for (const match of content.matchAll(CODE_PATTERN)) {
    const normalizedCode = normalizeCode(match[1] || "");
    if (!normalizedCode) {
      continue;
    }
    results.push({
      code: normalizedCode,
      source: "discord",
      sourceMessageId: id,
      expiredOn,
    });
  }

  return results;
};

const collectMessages = (body) => {
  if (Array.isArray(body)) {
    return body;
  }
  if (Array.isArray(body?.messages)) {
    return body.messages;
  }
  return null;
};

const createRedeemCode = async ({ code, source, sourceMessageId, expiredOn }) => {
  try {
    const createdCode = await prisma.redeemCode.create({
      data: {
        code,
        source,
        ...(sourceMessageId ? { sourceMessageId } : {}),
        ...(expiredOn ? { expiredOn } : {}),
      },
    });

    return {
      created: true,
      code: createdCode.code,
      status: createdCode.status,
      id: createdCode.id,
      expiredOn: createdCode.expiredOn ?? null,
    };
  } catch (err) {
    if (err?.code === "P2002") {
      const existingCode = await prisma.redeemCode.findUnique({
        where: { code },
      });

      if (!existingCode) {
        throw err;
      }

      return {
        created: false,
        code: existingCode.code,
        status: existingCode.status,
        id: existingCode.id,
        expiredOn: existingCode.expiredOn ?? null,
      };
    }

    throw err;
  }
};

export const POST = async (req) => {
  const expectedApiKey = process.env.CODES_API_KEY;
  const providedApiKey = req.headers.get("x-api-key");

  if (!expectedApiKey) {
    return new NextResponse(
      JSON.stringify({ message: "API key is not configured." }),
      { status: 500 }
    );
  }

  if (providedApiKey !== expectedApiKey) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized." }),
      { status: 401 }
    );
  }

  let body;

  try {
    body = await req.json();
  } catch (err) {
    logWarn("invalid JSON payload", { error: err?.message });
    return new NextResponse(
      JSON.stringify({ message: "Invalid JSON payload." }),
      { status: 400 }
    );
  }

  logInfo("payload received", describePayload(body));

  const items = collectMessages(body);

  if (items) {
    const extracted = items.flatMap(extractCodesFromMessage);

    if (!extracted.length) {
      logInfo("no codes extracted", { items: items.length });
      return new NextResponse(
        JSON.stringify({ extracted: 0, created: 0, results: [] }),
        { status: 200 }
      );
    }

    const seen = new Set();
    const unique = [];

    for (const entry of extracted) {
      if (seen.has(entry.code)) {
        continue;
      }
      seen.add(entry.code);
      unique.push(entry);
    }

    try {
      const results = [];
      for (const entry of unique) {
        results.push(await createRedeemCode(entry));
      }

      const createdCount = results.filter((result) => result.created).length;

      if (createdCount > 0) {
        revalidateTag("redeem-codes");
      }

      logInfo("codes processed", {
        extracted: extracted.length,
        unique: unique.length,
        created: createdCount,
      });

      return new NextResponse(
        JSON.stringify({
          extracted: extracted.length,
          created: createdCount,
          results,
        }),
        { status: 200 }
      );
    } catch (err) {
      logError("failed to create codes", { error: err?.message });
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong! Check the server previous log." }),
        { status: 500 }
      );
    }
  }

  const rawCode = typeof body?.code === "string" ? body.code : "";
  const normalizedCode = normalizeCode(rawCode || "");

  if (!normalizedCode) {
    logWarn("no valid code or content in payload", describePayload(body));
    return new NextResponse(
      JSON.stringify({
        message:
          "Valid Code is required. Provide {code} or a message with {content}.",
      }),
      { status: 400 }
    );
  }

  const source =
    typeof body?.source === "string" && body.source.trim()
      ? body.source.trim()
      : "unknown";
  const sourceMessageId =
    typeof body?.sourceMessageId === "string" && body.sourceMessageId.trim()
      ? body.sourceMessageId.trim()
      : undefined;

  const rawExpiredOn =
    typeof body?.expiredOn === "string" ? body.expiredOn.trim() : "";
  const expiredOn = parseExpiredOn(rawExpiredOn);

  if (rawExpiredOn && !expiredOn) {
    logWarn("invalid expiredOn value", { expiredOn: rawExpiredOn });
    return new NextResponse(
      JSON.stringify({ message: "Invalid expiredOn value." }),
      { status: 400 }
    );
  }

  try {
    const result = await createRedeemCode({
      code: normalizedCode,
      source,
      sourceMessageId,
      expiredOn,
    });

    if (result.created) {
      revalidateTag("redeem-codes");
    }

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (err) {
    logError("failed to create code", { error: err?.message });
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong! Check the server previous log." }),
      { status: 500 }
    );
  }
};
