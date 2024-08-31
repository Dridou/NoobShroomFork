// app/api/shop/[shopId]/route.js

import { NextResponse } from 'next/server';
import prisma from '@/utils/connect'; // Assurez-vous d'importer correctement votre instance Prisma

export async function GET(req, { params }) {
  const { shopId } = params; // Récupère shopId depuis l'URL

  try {
    const [shopItems, shop] = await Promise.all([
		prisma.shopItem.findMany({
		  where: { shopId }, // Filter by shopId
		  orderBy: { displayOrder: 'asc' },
		}),
		prisma.shop.findUnique({
		  where: { id: shopId }, // Find the shop by its id
		  select: { money: true}, // Select only the money field
		}),
	  ]);


    return NextResponse.json({ shopItems, money: shop.money });
  } catch (error) {
    console.error('Error fetching shop items:', error);
    return NextResponse.json({ error: 'Failed to fetch shop items' }, { status: 500 });
  }
}
