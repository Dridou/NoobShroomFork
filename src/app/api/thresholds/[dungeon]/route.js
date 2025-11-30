// app/api/thresholds/[dungeon]/route.js
import { NextResponse } from 'next/server';
import prisma from "@/utils/connect";

export async function GET(request, { params }) {
  const { dungeon } = params;

  try {
    const dungeonData = await prisma.dungeon.findUnique({
      where: {
        name: dungeon, // Trouver le donjon par nom
      },
	  include: {
		thresholds: true, // Inclure les seuils
	  }
	});

    if (!dungeonData) {
      return NextResponse.json({ error: 'Dungeon not found' }, { status: 404 });
    }

    return NextResponse.json(dungeonData.thresholds);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching thresholds' }, { status: 500 });
  }
}
