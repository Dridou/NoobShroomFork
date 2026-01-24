import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/utils/connect";
import {
  getOrCreateAnonId,
  setAnonIdCookie,
  verifyAnonIdCookie,
} from "@/utils/anonIdUtils";

// Simple in-memory rate limit store (replace with Redis for production)
const rateLimitStore = new Map();

const getRequestIp = (req) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
};

/**
 * Check rate limit (20 votes per minute per IP/anonId)
 */
function checkRateLimit(key) {
  const now = Date.now();
  const limit = 20; // max 20 votes per minute
  const windowMs = 60000; // 1 minute

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }

  const timestamps = rateLimitStore.get(key);

  // Remove old timestamps outside the window
  const filtered = timestamps.filter((ts) => now - ts < windowMs);

  if (filtered.length >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((filtered[0] + windowMs - now) / 1000),
    };
  }

  filtered.push(now);
  rateLimitStore.set(key, filtered);

  return { allowed: true };
}

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
    return NextResponse.json(
      { error: "Vote must be 1 or -1" },
      { status: 400 }
    );
  }

  try {
    // Get or create anonId
    const { anonId, cookieValue, isNew } = getOrCreateAnonId(req.cookies);

    // Check rate limit (by IP and anonId combined for extra safety)
    const ip = getRequestIp(req);
    const rateLimitKey = `${ip}:${anonId}`;
    const rateCheck = checkRateLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      const response = NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );
      if (isNew) {
        setAnonIdCookie(response, cookieValue);
      }
      return response;
    }

    // Verify build exists
    const build = await prisma.talentBuild.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!build) {
      return NextResponse.json(
        { error: "Build not found" },
        { status: 404 }
      );
    }

    // Check if user already voted on this build
    const existingVote = await prisma.talentBuildVote.findUnique({
      where: {
        buildId_anonId: {
          buildId: id,
          anonId,
        },
      },
    });

    let updatedBuild;

    if (existingVote) {
      // User already voted
      if (existingVote.vote === vote) {
        // Same vote, no change
        const current = await prisma.talentBuild.findUnique({
          where: { id },
          select: { likes: true, dislikes: true },
        });

        const response = NextResponse.json({
          likes: current?.likes ?? 0,
          dislikes: current?.dislikes ?? 0,
          userVote: vote,
          message: "Vote unchanged",
        });

        if (isNew) {
          setAnonIdCookie(response, cookieValue);
        }

        return response;
      }

      // Change vote (1 -> -1 or -1 -> 1)
      const likeDelta = vote === 1 ? 1 : -1;
      const dislikeDelta = vote === -1 ? 1 : -1;

      const [, updatedBuildResult] = await prisma.$transaction([
        prisma.talentBuildVote.update({
          where: { id: existingVote.id },
          data: { vote },
        }),
        prisma.talentBuild.update({
          where: { id },
          data: {
            likes: { increment: existingVote.vote === 1 ? -1 : 1 },
            dislikes: { increment: existingVote.vote === -1 ? -1 : 1 },
          },
          select: { likes: true, dislikes: true },
        }),
      ]);

      updatedBuild = updatedBuildResult;
    } else {
      // New vote
      const [, createdBuildResult] = await prisma.$transaction([
        prisma.talentBuildVote.create({
          data: {
            buildId: id,
            anonId,
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

      updatedBuild = createdBuildResult;
    }

    const response = NextResponse.json({
      likes: updatedBuild.likes,
      dislikes: updatedBuild.dislikes,
      userVote: vote,
      message: existingVote ? "Vote updated" : "Vote recorded",
    });

    // Set cookie (both new and existing, to refresh maxAge)
    setAnonIdCookie(response, cookieValue);

    return response;
  } catch (error) {
    console.error("Talent build vote error:", error);
    return NextResponse.json(
      { error: "Failed to vote" },
      { status: 500 }
    );
  }
}
