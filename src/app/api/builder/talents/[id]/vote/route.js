import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/utils/connect";

const getRequestIp = (req) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
};

const hashIp = (ip, userAgent) => {
  const salt = process.env.VOTE_HASH_SALT || "";
  return crypto
    .createHash("sha256")
    .update(`${ip}|${userAgent || ""}|${salt}`)
    .digest("hex");
};

export async function POST(req, { params }) {
  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: "Missing build id" }, { status: 400 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const vote = Number(payload?.vote);
  if (vote !== 1 && vote !== -1) {
    return NextResponse.json({ error: "Vote must be 1 or -1" }, { status: 400 });
  }

  try {
    const build = await prisma.talentBuild.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!build) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    const ip = getRequestIp(req);
    const userAgent = req.headers.get("user-agent") || "";
    const ipHash = hashIp(ip, userAgent);

    const existingVote = await prisma.talentBuildVote.findUnique({
      where: {
        buildId_ipHash: {
          buildId: id,
          ipHash,
        },
      },
    });

    if (existingVote) {
      if (existingVote.vote === vote) {
        const current = await prisma.talentBuild.findUnique({
          where: { id },
          select: { likes: true, dislikes: true },
        });
        return NextResponse.json({
          likes: current?.likes ?? 0,
          dislikes: current?.dislikes ?? 0,
          message: "Vote unchanged",
        });
      }

      const likeDelta = vote === 1 ? 1 : 0;
      const dislikeDelta = vote === -1 ? 1 : 0;
      const oldLikeDelta = existingVote.vote === 1 ? -1 : 0;
      const oldDislikeDelta = existingVote.vote === -1 ? -1 : 0;

      const [, updatedBuild] = await prisma.$transaction([
        prisma.talentBuildVote.update({
          where: { id: existingVote.id },
          data: { vote },
        }),
        prisma.talentBuild.update({
          where: { id },
          data: {
            likes: { increment: likeDelta + oldLikeDelta },
            dislikes: { increment: dislikeDelta + oldDislikeDelta },
          },
          select: { likes: true, dislikes: true },
        }),
      ]);

      return NextResponse.json({
        likes: updatedBuild.likes,
        dislikes: updatedBuild.dislikes,
        message: "Vote updated",
      });
    }

    const [, createdBuild] = await prisma.$transaction([
      prisma.talentBuildVote.create({
        data: {
          buildId: id,
          ipHash,
          vote,
        },
      }),
      prisma.talentBuild.update({
        where: { id },
        data: {
          likes: { increment: vote === 1 ? 1 : 0 },
          dislikes: { increment: vote === -1 ? 1 : 0 },
        },
        select: { likes: true, dislikes: true },
      }),
    ]);

    return NextResponse.json({
      likes: createdBuild.likes,
      dislikes: createdBuild.dislikes,
      message: "Vote recorded",
    });
  } catch (error) {
    console.error("Talent build vote error:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
