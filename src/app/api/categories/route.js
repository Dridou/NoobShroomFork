import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { EXCLUDED_CATEGORIES } from "@/utils/appConstants";

export const GET = async () => {
  let query = {
    where: {
      slug: {
        notIn: EXCLUDED_CATEGORIES,
      },
    },
  };

  try {
    const categories = await prisma.category.findMany(query);

    return new NextResponse(JSON.stringify(categories, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};
