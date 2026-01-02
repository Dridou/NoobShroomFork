import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

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
    const createdCode = await prisma.redeemCode.create({
      data: {
        code: normalizedCode,
        source,
        ...(expiredOn ? { expiredOn } : {}),
      },
    });

    return new NextResponse(
      JSON.stringify({
        created: true,
        code: createdCode.code,
        status: createdCode.status,
        id: createdCode.id,
        expiredOn: createdCode.expiredOn ?? null,
      }),
      { status: 200 }
    );
  } catch (err) {
    if (err?.code === "P2002") {
      const existingCode = await prisma.redeemCode.findUnique({
        where: { code: normalizedCode },
      });

      if (!existingCode) {
        return new NextResponse(
          JSON.stringify({ message: "Something went wrong!" }),
          { status: 500 }
        );
      }

      return new NextResponse(
        JSON.stringify({
          created: false,
          code: existingCode.code,
          status: existingCode.status,
          id: existingCode.id,
          expiredOn: existingCode.expiredOn ?? null,
        }),
        { status: 200 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
