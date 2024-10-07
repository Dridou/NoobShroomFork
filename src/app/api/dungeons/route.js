// app/api/dungeons/route.js
import { NextResponse } from 'next/server';
import prisma from "@/utils/connect";

export async function GET() {
  try {
    const dungeons = await prisma.dungeon.findMany({
	  include: {
		thresholds: true,
	  }
    });

    return NextResponse.json(dungeons);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching dungeons' }, { status: 500 });
  }
}
