import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import {
  EXCLUDED_CATEGORIES,
  FEATURED_POSTS_LIMIT,
  POSTS_PER_PAGE,
} from "@/utils/constants";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page");
  const cat = searchParams.get("cat");
  const sortBy = searchParams.get("sortBy");

  const where = {
    catSlug: {
      notIn: EXCLUDED_CATEGORIES,
    },
    ...(cat && { catSlug: cat }),
  };

  const orderBy =
    sortBy === "views"
      ? { views: "desc" }
      : { createdAt: "desc" };

  const pagination = page
    ? { take: POSTS_PER_PAGE, skip: POSTS_PER_PAGE * (page - 1) }
    : { take: FEATURED_POSTS_LIMIT };

  const query = {
    ...pagination,
    where,
    orderBy,
    ...(!page && {
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
    ]);
    return new NextResponse(JSON.stringify({ posts, count }, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// CREATE A POST
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  try {
    const body = await req.json();
    const post = await prisma.post.create({
      data: { ...body, userEmail: session.user.email },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
