import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();
const REDEEM_CODES_REVALIDATE_SECONDS = 60 * 60 * 12;

export const fetchPostSlugs = async () => {
  const posts = await prisma.post.findMany({
    select: {
      slug: true,
    },
  });

  if (!posts) {
    throw new Error("No post found in the database");
  }

  return posts.map((post) => ({
    slug: post.slug,
  }));
};

export const fetchShopsData = async () => {
  const shops = await prisma.shop.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    include: {
      shopItems: {
        orderBy: {
          displayOrder: "asc",
        },
      },
      section: true,
    },
  });

  if (!shops) {
    throw new Error("Shops not found");
  }

  return shops;
};

export const fetchUpdatesData = async () => {
  const updates = await prisma.update.findMany({
    include: {
      post: true,
      section: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!updates) {
    throw new Error("Updates not found");
  }

  return updates;
};

export const fetchRedeemCodes = async () => {
  const getCodes = unstable_cache(
    async () => {
      const codes = await prisma.redeemCode.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return codes;
    },
    ["redeem-codes"],
    { revalidate: REDEEM_CODES_REVALIDATE_SECONDS, tags: ["redeem-codes"] }
  );

  return getCodes();
};

export const fetchPostData = async (slug) => {
  console.log(slug);
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      user: true,
      sections: {
        include: {
          sets: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
      shop: {
        include: {
          shopItems: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

