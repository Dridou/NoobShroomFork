import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      where: {
        catSlug: {
          notIn: ["legal", "shops", "database"],
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
