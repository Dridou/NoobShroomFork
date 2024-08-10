import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  const excludedCategories = ["legal","shops","database"];

  let query = {
    where: {
      slug: {
        notIn: excludedCategories,
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