import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [posts] = await prisma.post.findMany();

    return NextResponse(JSON.stringify({ posts }, { statue: 200 }));
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
}
