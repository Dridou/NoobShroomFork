import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

const CODE_PATTERN = /gift\s*code\s*[:\-]\s*([A-Za-z0-9_-]+)/gi;
const DATE_PATTERN = /valid\s*until\s*([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4})/i;

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

const extractCodesFromMessage = (message) => {
  const content = typeof message?.content === "string" ? message.content : "";
  if (!content) {
    return [];
  }

  const dateMatch = content.match(DATE_PATTERN);
  const expiredOn = dateMatch ? parseMmDdYyyy(dateMatch[1]) : null;
  const sourceMessageId = message?.id ? String(message.id) : undefined;
  const results = [];

  for (const match of content.matchAll(CODE_PATTERN)) {
    const normalizedCode = normalizeCode(match[1] || "");
    if (!normalizedCode) {
      continue;
    }
    results.push({
      code: normalizedCode,
      source: "discord",
      sourceMessageId,
      expiredOn,
    });
  }

  return results;
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
    return new NextResponse(
      JSON.stringify({ message: "Invalid JSON payload." }),
      { status: 400 }
    );
  }

  const items = Array.isArray(body)
    ? body
    : Array.isArray(body?.items)
    ? body.items
    : Array.isArray(body?.messages)
    ? body.messages
    : null;

  if (items) {
    const extracted = items.flatMap(extractCodesFromMessage);

    if (!extracted.length) {
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

      return new NextResponse(
        JSON.stringify({
          extracted: extracted.length,
          created: createdCount,
          results,
        }),
        { status: 200 }
      );
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong! Check the server previous log." }),
        { status: 500 }
      );
    }
  }

  const rawCode = typeof body?.code === "string" ? body.code : "";
  const normalizedCode = normalizeCode(rawCode || "");

  if (!normalizedCode) {
    return new NextResponse(
      JSON.stringify({ message: "Valid Code is required." }),
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

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong! Check the server previous log." }),
      { status: 500 }
    );
  }
};
