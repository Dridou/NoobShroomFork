import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

export async function GET(req, { params }) {
  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: "Missing build id" }, { status: 400 });
  }

  try {
    const build = await prisma.talentBuild.findUnique({
      where: { id },
    });

    if (!build) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    return NextResponse.json(build);
  } catch (error) {
    console.error("Talent build fetch error:", error);
    return NextResponse.json({ error: "Failed to load build" }, { status: 500 });
  }
}
