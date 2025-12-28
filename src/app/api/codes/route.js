import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  let body;

  try {
    body = await req.json();
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid JSON payload." }),
      { status: 400 }
    );
  }

  const rawCode = typeof body?.code === "string" ? body.code : "";
  const normalizedCode = rawCode.trim().toUpperCase();

  if (!normalizedCode) {
    return new NextResponse(
      JSON.stringify({ message: "Valid Code is required." }),
      { status: 400 }
    );
  }

  const source =
    typeof body?.source === "string" && body.source.trim()
      ? body.source.trim()
      : "unknown";
  const sourceMessageId =
    typeof body?.sourceMessageId === "string" && body.sourceMessageId.trim()
      ? body.sourceMessageId.trim()
      : undefined;

  try {
    const createdCode = await prisma.redeemCode.create({
      data: {
        code: normalizedCode,
        source,
        ...(sourceMessageId ? { sourceMessageId } : {}),
      },
    });

    return new NextResponse(
      JSON.stringify({
        created: true,
        code: createdCode.code,
        status: createdCode.status,
        id: createdCode.id,
      }),
      { status: 200 }
    );
  } catch (err) {
    if (err?.code === "P2002") {
      const existingCode = await prisma.redeemCode.findUnique({
        where: { code: normalizedCode },
      });

      if (!existingCode) {
		console.log(err);
        return new NextResponse(
          JSON.stringify({ message: "Something went wrong!" }),
          { status: 500 }
        );
      }

      return new NextResponse(
        JSON.stringify({
          created: false,
          code: existingCode.code,
          status: existingCode.status,
          id: existingCode.id,
        }),
        { status: 200 }
      );
    }

    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong! Check the server previous log." }),
      { status: 500 }
    );
  }
};
