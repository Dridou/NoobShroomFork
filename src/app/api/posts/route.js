import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page");
  const cat = searchParams.get("cat");
  const sortBy = searchParams.get("sortBy");

  const POST_PER_PAGE = 4;

  const excludedCategories = ["legal","shops","database"];

  let query = null;

  if (page) {
    query = {
      take: POST_PER_PAGE,
      skip: POST_PER_PAGE * (page - 1),
      where: {
		catSlug: {
		  notIn: excludedCategories,
		},
		...(cat && { catSlug: cat }),
	  },
    //   orderBy: {
    //     ...(sortBy === "views" ? { views: "desc" } : { createdAt: "desc" }),
    //   },
    };
  }
  else {
	query = {
		take: 5,
		// skip: POST_PER_PAGE * (page - 1),
		where: {
			catSlug: {
			  notIn: excludedCategories,
			},
			...(cat && { catSlug: cat }),
		  },
		include: {
		  user: {
			select: {
			  name: true,
			},
		  },
		},
		orderBy: {
		  ...(sortBy === "views" ? { views: "desc" } : { createdAt: "desc" }),
		},
	  };
  }

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
