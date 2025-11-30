// app/api/shop/[shopId]/route.js

import { NextResponse } from "next/server";
import prisma from "@/utils/connect"; // Assurez-vous d'importer correctement votre instance Prisma

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get("shopId");

  try {
    const [shopItems, shop] = await Promise.all([
      prisma.shopItem.findMany({
        where: { id: shopId }, // Filter by shopId
        orderBy: { displayOrder: "asc" },
      }),
      prisma.shop.findUnique({
        where: { id: shopId }, // Find the shop by its id
        include: {
          shopItems: true, // Inclut les articles du magasin
        },
      }),
    ]);

    if (!shop) {
      return NextResponse.json({ message: "Shop not found" }, { status: 404 });
    }
    if (!shopItems) {
      return NextResponse.json(
        { message: "Shop items not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ shopItems, money: shop.money }, { status: 200 });
  } catch (error) {
    console.error("Error fetching shop items:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop items" },
      { status: 500 }
    );
  }
}
