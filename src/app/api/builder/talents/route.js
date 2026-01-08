import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/utils/connect";

const VALID_TAGS = ["PvE", "PvP", "F2P", "Whale"];
const DEFAULT_SCHEMA_VERSION = 1;

const isPlainObject = (value) =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const hasTabConfig = (config, key) => isPlainObject(config?.[key]);

const sanitizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.filter((tag) => VALID_TAGS.includes(tag)))];
};

const createBuildId = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = crypto.randomBytes(6).toString("base64url");
    const existing = await prisma.talentBuild.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return id;
    }
  }
  throw new Error("Failed to generate a unique build id.");
};

export async function POST(req) {
  try {
    const payload = await req.json();
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { config, maxFeathers, name, creatorName, tags, schemaVersion } = payload;
    if (!isPlainObject(config)) {
      return NextResponse.json({ error: "config is required" }, { status: 400 });
    }

    if (
      !hasTabConfig(config, "fury") ||
      !hasTabConfig(config, "archery") ||
      !hasTabConfig(config, "sorcery") ||
      !hasTabConfig(config, "tameBeasts")
    ) {
      return NextResponse.json(
        { error: "config must include all four tabs" },
        { status: 400 }
      );
    }

    const feathers = Number(maxFeathers);
    if (!Number.isFinite(feathers) || feathers < 0) {
      return NextResponse.json(
        { error: "maxFeathers must be a positive number" },
        { status: 400 }
      );
    }

    const id = await createBuildId();

    const build = await prisma.talentBuild.create({
      data: {
        id,
        config,
        maxFeathers: Math.floor(feathers),
        schemaVersion: Number(schemaVersion) || DEFAULT_SCHEMA_VERSION,
        name: name || null,
        creatorName: creatorName || null,
        tags: sanitizeTags(tags),
      },
    });

    return NextResponse.json({
      ...build,
      url: `/builder/talents/${build.id}`,
    });
  } catch (error) {
    console.error("Talent build create error:", error);
    return NextResponse.json({ error: "Failed to save build" }, { status: 500 });
  }
}
