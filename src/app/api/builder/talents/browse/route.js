import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt"; // createdAt, likes, dislikes
    const sortOrder = searchParams.get("sortOrder") || "desc"; // asc, desc
    const tag = searchParams.get("tag"); // PvE, PvP, F2P, Whale
    const search = searchParams.get("search"); // Search by name or creator

    const skip = (page - 1) * limit;

    // Build filter
    const where = {};

    if (tag) {
      where.tags = { has: tag };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { creatorName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.talentBuild.count({ where });

    // Get builds with sorting
    const builds = await prisma.talentBuild.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        creatorName: true,
        tags: true,
        likes: true,
        dislikes: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        [sortBy]: sortOrder === "asc" ? "asc" : "desc",
      },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      builds,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch builds:", error);
    return NextResponse.json(
      { error: "Failed to fetch builds" },
      { status: 500 }
    );
  }
}
