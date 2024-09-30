import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const cat = searchParams.get("cat");
  const sortBy = searchParams.get("sortBy");

  const excludedCategories = ["legal", "database"];

  // Construction de la requête Prisma
  const query = {
    where: {
      catSlug: {
        notIn: excludedCategories,
      },
      ...(cat && { catSlug: cat }), // Applique le filtre cat seulement si `cat` est défini
    },
    orderBy: {
      ...(sortBy === "views" ? { views: "desc"} : { createdAt: "desc" }),
    },
	...(sortBy === "views" ? {take : 5} : {}),
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
	console.log('sucees');
    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.log("Error fetching posts:", err);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
};
