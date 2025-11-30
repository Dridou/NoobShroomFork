// app/api/dungeons/route.js
import { NextResponse } from 'next/server';
import prisma from "@/utils/connect";

export async function GET() {
  try {
    const classes = await prisma.class.findMany({});

    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching classes' }, { status: 500 });
  }
}
