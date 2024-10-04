// src/app/posts/[slug]/page.js

import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Head from "next/head";
import styles from "./singlePage.module.css";
import SetSection from "@/components/setSection/SetSection";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";
import Link from "next/link";
import Shop from "@/components/Shop/Shop";
import Comments from "@/components/comments/Comments";
import "../../styles/colStyles.css";
import "../../styles/tableStyles.css";

import dynamic from 'next/dynamic';

// Importation dynamique du composant client TalentTree
const TalentTree = dynamic(() => import('@/components/TalentTree/TalentTree'), { ssr: false });

const prisma = new PrismaClient();

// Helper function to generate slug
const slugifyTitle = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s?]/g, "-")
    .replace(/[^\w-]+/g, "");
};

export async function generateMetadata({ params }) {
  const post = await fetchPostData(params.slug);

  // Slugs pour lesquels nous ne voulons pas d'indexation
  const noIndexSlugs = [
    "best-class",
    "terms",
    "privacy-policy",
    "source-credit",
    "contact-us",
    "about-us",
  ];

  if (!post || !post.metadata) {
    return {
      title: "Default Title",
      description: "Default description for SEO purposes.",
    };
  }

  const { metadata } = post;

  // Vérification si le slug est dans la liste des noIndexSlugs
  const isNoIndex = noIndexSlugs.includes(params.slug);

  return {
    title: metadata?.title || "Default Title",
    description:
      metadata?.description || "Default description for SEO purposes.",
    openGraph: {
      url: metadata?.url || "https://www.noobshroom.com",
      title: metadata?.title || "Default Title",
      description:
        metadata?.description || "Default description for SEO purposes.",
    },
    // Ajout de l'objet robots pour les slugs spécifiés
    robots: isNoIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined, // Pas de robots si le slug ne correspond pas
  };
}

// Fetch all posts for static paths generation
export async function generateStaticParams() {
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
}

// Fetch shops data for "what-to-buy-in-shops" page
const fetchShopsData = async () => {
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
    },
  });

  if (!shops) {
    throw new Error("Shops not found");
  }

  return shops;
};

// Fetch updates data for "updates" page
const fetchUpdatesData = async () => {
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

// Fetch post data based on slug
const fetchPostData = async (slug) => {
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

// Render shops section for "what-to-buy-in-shops" page
const renderShopsSection = (shops) => {
  if (shops.length === 0) {
    return <div>Shops not found</div>;
  }

  return (
    <>
      {shops.map((shop) => (
        <div
          key={shop.id}
          id={`${slugifyTitle(shop.title)}`}
          className={styles.shop}
        >
          <div className={styles.shopHeader}>
            <h2>{shop.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: shop.desc }}></p>
          </div>
          <Shop shop={shop} />
        </div>
      ))}
    </>
  );
};

// Render updates section for "updates" page
const renderUpdatesSection = (updates) => {
  if (updates.length === 0) {
    return <div>Updates not found</div>;
  }

  return updates.map((update) => (
    <div key={update.id} className={styles.update}>
      <div className={styles.fullHeader}>
        <span className={styles.creationDate}>
          {update.createdAt.toLocaleDateString()}
        </span>
        <div className={styles.updateHeader}>
          <h2>{update.title}</h2>
          <span>
            {update.post && update.section ? (
              <div className={styles.references}>
                <span className={styles.postReference}>
                  {update.post.title}
                </span>
                <span className={styles.arrow}>-</span>
                <span className={styles.sectionReference}>
                  {update.section.title}
                </span>
              </div>
            ) : (
              <div className={styles.references}>
                <span className={styles.noReference}>General</span>
              </div>
            )}
          </span>
        </div>
      </div>
      <p dangerouslySetInnerHTML={{ __html: update.content }}></p>
      {update.post && update.section ? (
        <Link
          href={`/posts/${update.post?.slug}/#${slugifyTitle(
            update.section.title
          )}`}
        >
          <span>
            → See{" "}
            <u>
              {update.post?.title}/{update.section?.title}
            </u>{" "}
            updated section
          </span>
        </Link>
      ) : null}
    </div>
  ));
};

// Render sections content for other pages
const renderSectionsContent = (post) => {
  return post.sections.map((section) => {
    console.log({ section });
    if (section.type === "set" && section.sets.length > 0) {
      return (
        <div
          key={section.id}
          id={`${slugifyTitle(section.title)}`}
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            {section.icon && (
              <Image
                src={section.icon}
                alt=""
                width={32}
                height={32}
                className={styles.sectionIcon}
              />
            )}
            {/* <div className={styles.headerTitle}><h2>{section.title}</h2> - {section.updatedAt
                  ? new Date(section.updatedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Unknown Date"}</div> */}
          </div>
          {section.sets.map((set, setIndex) => (
            <SetSection
              key={setIndex}
              id={set.id}
			  date={section.updatedAt
				? new Date(section.updatedAt).toLocaleDateString("en-US", {
					day: "numeric",
					month: "long",
					year: "numeric",
				  })
				: "Unknown Date"}
              title={set.title}
              standardImage={set.standardImage}
              opponentImage={set.opponentImage}
              opponentSpells={set.opponentSpells}
              explanation={set.explanation}
              timings={set.timings}
              alternatives={set.alternatives}
              palsImage={set.palsImage}
              palsAlternatives={set.palsAlternatives}
              relicsImage={set.relicsImage}
              relicsAlternatives={set.relicsAlternatives}
              talentImage={set.talentImage}
              talents={set.talents}
              mounts={set.mounts}
              artifacts={set.artifacts}
              accessories={set.accessories}
              avians={set.avians}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div
          key={section.id}
          id={`${slugifyTitle(section.title)}`}
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            {section.icon && (
              <Image
                src={section.icon}
                alt=""
                width={32}
                height={32}
                className={styles.sectionIcon}
              />
            )}
            <div className={styles.headerText}>
              <span className={styles.sectionDate}>
                {section.updatedAt
                  ? new Date(section.updatedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Unknown Date"}
              </span>
              <h2>{section.title}</h2>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      );
    }
  });
};

// Main page component
export default async function SinglePage({ params }) {
  const { slug } = params;
  let post;
  let sectionsContent;

  switch (slug) {
	case "talent-generator":
	  sectionsContent = <TalentTree />;
	  break;
    case "what-to-buy-in-shops":
      post = await fetchPostData(slug);
      const shops = await fetchShopsData();
      sectionsContent = renderShopsSection(shops);
      break;
    case "updates":
      post = await fetchPostData(slug);
      const updates = await fetchUpdatesData();
      sectionsContent = renderUpdatesSection(updates);
      break;
    default:
      post = await fetchPostData(slug);
      sectionsContent = renderSectionsContent(post);
      break;
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{post?.title}</h1>
          <div className={styles.user}>
            {post?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image
                  src={post.user.image}
                  alt="avatar image"
                  width={48}
                  height={48}
                  className={styles.avatar}
                />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{post?.user?.name}</span>
              {post?.updatedAt
                ? "Last update: " +
                  new Date(post.updatedAt).toISOString().substring(0, 10)
                : "Date not available"}{" "}
            </div>
          </div>
        </div>
        {post?.img && (
          <div className={styles.imageContainer}>
            <Image
              src={`/images/${post.img}`}
              alt=""
              width={300}
              height={400}
              className={styles.image}
            />
          </div>
        )}
      </div>

      {slug !== "updates" &&
      (slug === "what-to-buy-in-shops" ? post?.shop : post?.sections) ? (
        <div className={styles.tableOfContents}>
          <h2>Table of Contents</h2>
          <ul>
            {slug === "what-to-buy-in-shops"
              ? post.shop.map((shop) => (
                  <li key={shop.title}>
                    <a href={`#${slugifyTitle(shop.title)}`}>{shop.title}</a>
                  </li>
                ))
              : post.sections.map((section) => (
                  <li key={section.title}>
                    <a href={`#${slugifyTitle(section.title)}`}>
                      {section.title}
                    </a>
                  </li>
                ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.content}>
        {sectionsContent}
        <div className={styles.comment}>
          <Comments postSlug={slug} />
        </div>
        <div className={styles.bottomContent}>
          <CardList />
          <Menu />
        </div>
      </div>
    </div>
  );
}
