import { NextResponse } from "next/server";
import prisma from "@/utils/connect";
import { getOrCreateAnonId, setAnonIdCookie } from "@/utils/anonIdUtils";

export async function GET(req, { params }) {
  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: "Missing build id" }, { status: 400 });
  }

  try {
    // Get or create anonId (don't fail if cookie is rejected)
    const { anonId, cookieValue, isNew } = getOrCreateAnonId(req.cookies);

    const build = await prisma.talentBuild.findUnique({
      where: { id },
    });

    if (!build) {
      return NextResponse.json(
        { error: "Build not found" },
        { status: 404 }
      );
    }

    // Get user's vote for this build
    const userVote = await prisma.talentBuildVote.findUnique({
      where: {
        buildId_anonId: {
          buildId: id,
          anonId,
        },
      },
      select: { vote: true },
    });

    const response = NextResponse.json({
      ...build,
      userVote: userVote?.vote ?? null,
    });

    // Set cookie (with sliding expiration)
    setAnonIdCookie(response, cookieValue);

    return response;
  } catch (error) {
    console.error("Talent build fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load build" },
      { status: 500 }
    );
  }
}
