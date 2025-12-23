import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

const getRequestToken = (req) => {
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }
  return (
    req.headers.get("x-admin-token") ||
    req.headers.get("x-publish-token") ||
    ""
  ).trim();
};

const getServerToken = () =>
  process.env.ADMIN_PUBLISH_TOKEN || process.env.PUBLISH_TOKEN || "";

const getDefaultAuthorEmail = () =>
  process.env.PUBLISH_DEFAULT_AUTHOR_EMAIL ||
  process.env.PUBLISH_AUTHOR_EMAIL ||
  "";

const normalizeId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && typeof value.$oid === "string") {
    return value.$oid;
  }
  return null;
};

const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );

const getArray = (value) => (Array.isArray(value) ? value : []);

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value) return [value];
  return [];
};

const buildSummary = (payload) => {
  const sections = toArray(payload.sections || payload.post?.sections);
  const shops = toArray(payload.shops || payload.shop);
  const updates = toArray(payload.updates);
  const sets = sections.reduce(
    (count, section) => count + getArray(section.sets).length,
    0
  );
  const tables = sections.reduce(
    (count, section) => count + getArray(section.tables).length,
    0
  );
  const tableRows = sections.reduce((count, section) => {
    return (
      count +
      getArray(section.tables).reduce(
        (rowsCount, table) => rowsCount + getArray(table.rows).length,
        0
      )
    );
  }, 0);
  const shopItems = shops.reduce(
    (count, shop) => count + getArray(shop.shopItems).length,
    0
  );

  return {
    post: payload.post ? 1 : 0,
    sections: sections.length,
    sets,
    tables,
    tableRows,
    shops: shops.length,
    shopItems,
    updates: updates.length,
  };
};

const isPreviewMode = (req, body) => {
  const previewParam = req.nextUrl?.searchParams?.get("preview");
  return (
    previewParam === "true" ||
    body?.preview === true ||
    body?.dryRun === true
  );
};

const resolvePostId = async (slug) => {
  if (!slug) return null;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  });
  return post?.id || null;
};

export async function POST(req) {
  const serverToken = getServerToken();
  if (!serverToken) {
    return NextResponse.json(
      { error: "Server token missing. Set ADMIN_PUBLISH_TOKEN." },
      { status: 500 }
    );
  }

  const requestToken = getRequestToken(req);
  if (!requestToken || requestToken !== serverToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  }

  if (Array.isArray(payload.post)) {
    return NextResponse.json(
      { error: "Only one post per payload is supported." },
      { status: 400 }
    );
  }

  const summary = buildSummary(payload);
  if (isPreviewMode(req, payload)) {
    return NextResponse.json({ preview: true, summary }, { status: 200 });
  }

  const sections = toArray(payload.sections || payload.post?.sections);
  const shops = toArray(payload.shops || payload.shop);
  const updates = toArray(payload.updates);

  if (!payload.post && sections.length === 0 && shops.length === 0 && updates.length === 0) {
    return NextResponse.json(
      { error: "No publishable content found in payload." },
      { status: 400 }
    );
  }

  let postRecord = null;
  if (payload.post) {
    const postInput = payload.post;
    const slug = postInput.slug?.trim();
    if (!slug) {
      return NextResponse.json(
        { error: "post.slug is required" },
        { status: 400 }
      );
    }

    const defaultAuthorEmail = getDefaultAuthorEmail();
    if (!postInput.userEmail && defaultAuthorEmail) {
      postInput.userEmail = defaultAuthorEmail;
    }

    const existingPost = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingPost) {
      const requiredFields = ["title", "desc", "catSlug", "userEmail"];
      const missing = requiredFields.filter(
        (field) => !postInput[field]
      );
      if (missing.length > 0) {
        return NextResponse.json(
          { error: `Missing required post fields: ${missing.join(", ")}` },
          { status: 400 }
        );
      }
    }

    if (postInput.catSlug) {
      const category = await prisma.category.findUnique({
        where: { slug: postInput.catSlug },
        select: { slug: true },
      });
      if (!category) {
        const title =
          postInput.catTitle ||
          postInput.catSlug.replace(/-/g, " ").trim();
        await prisma.category.create({
          data: {
            slug: postInput.catSlug,
            title: title || postInput.catSlug,
            img: postInput.catImg,
          },
        });
      }
    }

    if (postInput.userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: postInput.userEmail },
        select: { email: true },
      });
      if (!user) {
        return NextResponse.json(
          { error: `User not found: ${postInput.userEmail}` },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "post.userEmail is required (or set PUBLISH_DEFAULT_AUTHOR_EMAIL)." },
        { status: 400 }
      );
    }

    const postData = clean({
      title: postInput.title,
      desc: postInput.desc,
      img: postInput.img,
      imgBig: postInput.imgBig,
      metadata: postInput.metadata,
      views: postInput.views,
      catSlug: postInput.catSlug,
      userEmail: postInput.userEmail,
      createdAt: postInput.createdAt ? new Date(postInput.createdAt) : undefined,
      updatedAt: postInput.updatedAt ? new Date(postInput.updatedAt) : undefined,
    });

    postRecord = await prisma.post.upsert({
      where: { slug },
      update: postData,
      create: {
        slug,
        ...postData,
      },
    });
  }

  const postIdFromPayload =
    payload.postId ||
    payload.post?.id ||
    (payload.postSlug ? await resolvePostId(payload.postSlug) : null);
  const resolvedPostId = postRecord?.id || postIdFromPayload;
  const postSlug = payload.post?.slug || payload.postSlug || null;

  for (const sectionInput of sections) {
    const sectionId = normalizeId(sectionInput.id || sectionInput._id);
    let sectionPostId =
      sectionInput.postId || resolvedPostId || null;

    if (!sectionPostId && sectionInput.postSlug) {
      sectionPostId = await resolvePostId(sectionInput.postSlug);
    }

    if (!sectionPostId) {
      return NextResponse.json(
        { error: "Section requires postId or postSlug (or a post in payload)." },
        { status: 400 }
      );
    }

    const sectionData = clean({
      title: sectionInput.title,
      content: sectionInput.content,
      icon: sectionInput.icon,
      type: sectionInput.type,
      displayOrder: sectionInput.displayOrder,
      postId: sectionPostId,
      createdAt: sectionInput.createdAt ? new Date(sectionInput.createdAt) : undefined,
      updatedAt: sectionInput.updatedAt ? new Date(sectionInput.updatedAt) : undefined,
    });

    let savedSection;
    if (sectionId) {
      savedSection = await prisma.section.upsert({
        where: { id: sectionId },
        update: sectionData,
        create: {
          id: sectionId,
          ...sectionData,
        },
      });
    } else {
      if (!sectionInput.title || !sectionInput.content) {
        return NextResponse.json(
          { error: "Section create requires title and content." },
          { status: 400 }
        );
      }
      savedSection = await prisma.section.create({ data: sectionData });
    }

    const sectionSets = getArray(sectionInput.sets);
    for (const setInput of sectionSets) {
      const setId = normalizeId(setInput.id || setInput._id);
      const setData = clean({
        title: setInput.title,
        standardImage: setInput.standardImage,
        opponentImage: setInput.opponentImage,
        opponentSpells: setInput.opponentSpells,
        explanation: setInput.explanation,
        timings: setInput.timings,
        alternatives: setInput.alternatives,
        palsImage: setInput.palsImage,
        palsAlternatives: setInput.palsAlternatives,
        relicsImage: setInput.relicsImage,
        relicsAlternatives: setInput.relicsAlternatives,
        talentImage: setInput.talentImage,
        talents: setInput.talents,
        mounts: setInput.mounts,
        artifacts: setInput.artifacts,
        accessories: setInput.accessories,
        avians: setInput.avians,
        sectionId: savedSection.id,
      });

      if (setId) {
        const existing = await prisma.set.findUnique({
          where: { id: setId },
          select: { id: true },
        });
        if (existing) {
          return NextResponse.json(
            { error: `Append-only: Set already exists (${setId}).` },
            { status: 409 }
          );
        }
      }

      if (!setInput.title || !setInput.talents) {
        return NextResponse.json(
          { error: "Set create requires title and talents." },
          { status: 400 }
        );
      }
      await prisma.set.create({
        data: {
          ...(setId ? { id: setId } : {}),
          ...setData,
        },
      });
    }

    const sectionTables = getArray(sectionInput.tables);
    for (const tableInput of sectionTables) {
      const tableId = normalizeId(tableInput.id || tableInput._id);
      const tableData = clean({
        title: tableInput.title,
        sectionId: savedSection.id,
      });

      if (tableId) {
        const existingTable = await prisma.table.findUnique({
          where: { id: tableId },
          select: { id: true },
        });
        if (existingTable) {
          return NextResponse.json(
            { error: `Append-only: Table already exists (${tableId}).` },
            { status: 409 }
          );
        }
      }

      if (!tableInput.title) {
        return NextResponse.json(
          { error: "Table create requires title." },
          { status: 400 }
        );
      }

      const savedTable = await prisma.table.create({
        data: {
          ...(tableId ? { id: tableId } : {}),
          ...tableData,
        },
      });

      const rows = getArray(tableInput.rows);
      if (rows.length > 0) {
        for (const rowInput of rows) {
          const rowId = normalizeId(rowInput.id || rowInput._id);
          const rowData = clean({
            stat: rowInput.stat,
            explanation: rowInput.explanation,
            tableId: savedTable.id,
          });

          if (rowId) {
            const existingRow = await prisma.tableRow.findUnique({
              where: { id: rowId },
              select: { id: true },
            });
            if (existingRow) {
              return NextResponse.json(
                { error: `Append-only: TableRow already exists (${rowId}).` },
                { status: 409 }
              );
            }
          }

          if (!rowInput.stat || !rowInput.explanation) {
            return NextResponse.json(
              { error: "TableRow create requires stat and explanation." },
              { status: 400 }
            );
          }
          await prisma.tableRow.create({
            data: {
              ...(rowId ? { id: rowId } : {}),
              ...rowData,
            },
          });
        }
      }
    }
  }

  for (const shopInput of shops) {
    const shopId = normalizeId(shopInput.id || shopInput._id);
    let shopPostId =
      shopInput.postId || resolvedPostId || null;

    if (!shopPostId && shopInput.postSlug) {
      shopPostId = await resolvePostId(shopInput.postSlug);
    }

    if (!shopPostId) {
      return NextResponse.json(
        { error: "Shop requires postId or postSlug (or a post in payload)." },
        { status: 400 }
      );
    }

    const shopData = clean({
      title: shopInput.title,
      desc: shopInput.desc,
      money: shopInput.money,
      displayOrder: shopInput.displayOrder,
      postId: shopPostId,
    });

    let savedShop;
    if (shopId) {
      savedShop = await prisma.shop.upsert({
        where: { id: shopId },
        update: shopData,
        create: {
          id: shopId,
          ...shopData,
        },
      });
    } else {
      if (!shopInput.title || !shopInput.money) {
        return NextResponse.json(
          { error: "Shop create requires title and money." },
          { status: 400 }
        );
      }
      savedShop = await prisma.shop.create({ data: shopData });
    }

    const shopItems = getArray(shopInput.shopItems);
    for (const itemInput of shopItems) {
      const itemId = normalizeId(itemInput.id || itemInput._id);
      const itemData = clean({
        objectImage: itemInput.objectImage,
        objectName: itemInput.objectName,
        price: itemInput.price,
        priority: itemInput.priority,
        explanation: itemInput.explanation,
        displayOrder: itemInput.displayOrder,
        shopId: savedShop.id,
      });

      if (itemId) {
        const existingItem = await prisma.shopItem.findUnique({
          where: { id: itemId },
          select: { id: true },
        });
        if (existingItem) {
          return NextResponse.json(
            { error: `Append-only: ShopItem already exists (${itemId}).` },
            { status: 409 }
          );
        }
      }

      if (!itemInput.objectImage || !itemInput.objectName || itemInput.price === undefined) {
        return NextResponse.json(
          { error: "ShopItem create requires objectImage, objectName, and price." },
          { status: 400 }
        );
      }
      await prisma.shopItem.create({
        data: {
          ...(itemId ? { id: itemId } : {}),
          ...itemData,
        },
      });
    }
  }

  for (const updateInput of updates) {
    const updateId = normalizeId(updateInput.id || updateInput._id);
    const updateData = clean({
      title: updateInput.title,
      content: updateInput.content,
      postSlug: updateInput.postSlug || postSlug,
      sectionId: updateInput.sectionId,
      createdAt: updateInput.createdAt ? new Date(updateInput.createdAt) : undefined,
      updatedAt: updateInput.updatedAt ? new Date(updateInput.updatedAt) : undefined,
    });

    if (updateId) {
      const existingUpdate = await prisma.update.findUnique({
        where: { id: updateId },
        select: { id: true },
      });
      if (existingUpdate) {
        return NextResponse.json(
          { error: `Append-only: Update already exists (${updateId}).` },
          { status: 409 }
        );
      }
    }

    if (!updateInput.title || !updateInput.content) {
      return NextResponse.json(
        { error: "Update create requires title and content." },
        { status: 400 }
      );
    }
    await prisma.update.create({
      data: {
        ...(updateId ? { id: updateId } : {}),
        ...updateData,
      },
    });
  }

  return NextResponse.json({ ok: true, summary }, { status: 200 });
}
