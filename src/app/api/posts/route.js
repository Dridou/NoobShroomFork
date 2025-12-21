import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { EXCLUDED_CATEGORIES } from "@/utils/appConstants";

export const dynamic = 'force-dynamic';

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const cat = searchParams.get("cat")?.trim();
  const sortBy = searchParams.get("sortBy");

  const allowedSortFields = new Set(["views", "createdAt"]);
  const normalizedSort = allowedSortFields.has(sortBy)
    ? sortBy
    : "createdAt";

  // Construction de la requête Prisma
  const query = {
    where: {
      catSlug: {
        notIn: EXCLUDED_CATEGORIES,
        ...(cat ? { equals: cat } : {}),
      },
    },
    orderBy:
      normalizedSort === "views"
        ? { views: "desc" }
        : { createdAt: "desc" },
    ...(normalizedSort === "views" ? { take: 5 } : {}),
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  };

  try {
    // Récupère tous les posts correspondant à la requête
    const posts = await prisma.post.findMany(query);
    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.log("Error fetching posts:", err);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
};
