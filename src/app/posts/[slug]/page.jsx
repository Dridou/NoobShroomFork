// src/app/posts/[slug]/page.js

import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Script from "next/script";
import styles from "./singlePage.module.css";
import SetSection from "@/components/sets/setSection/SetSection";
import CardList from "@/components/blog/cardList/CardList";
import Menu from "@/components/blog/Menu/Menu";
import Link from "next/link";
import Shop from "@/components/shop/Shop/Shop";
import Comments from "@/components/blog/comments/Comments";
import "../../styles/colStyles.css";
import "../../styles/tableStyles.css";

import dynamic from 'next/dynamic';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  isNoIndexSlug,
} from "@/utils/seo";
// Import dynamique du bouton d'édition pour le rendre client-only
const EditSectionButton = dynamic(() => import("@/components/sets/EditSectionButton/EditSectionButton"), {
  ssr: false,
});

// Importation dynamique du composant client TalentTree
const TalentTree = dynamic(() => import('@/components/talent/TalentTree/TalentTree'), { ssr: false });

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

	// Liste des slugs pour lesquels nous voulons ajouter la balise meta spécifique
	const slugsWithMeta = ["arrowgod-class-guide", "mage-prophet-tank-regen"];

	// Vérification si le slug est dans la liste des noIndexSlugs
	const isNoIndex = isNoIndexSlug(params.slug);

	const postUrl = `${SITE_URL}/posts/${params.slug}`;
	const postImage = post.imgBig || post.img ? `${SITE_URL}/images/${post.imgBig || post.img}` : null;
	const metaTitle = post?.metadata?.title || post?.title || DEFAULT_TITLE;
	const metaDescription =
	  post?.metadata?.description || post?.desc || DEFAULT_DESCRIPTION;

	const metadata = {
	  title: metaTitle,
	  description: metaDescription,
	  alternates: {
		canonical: postUrl,
	  },
	  openGraph: {
		url: postUrl,
		title: metaTitle,
		description: metaDescription,
		images: postImage ? [{ url: postImage }] : undefined,
	  },
	  twitter: {
		card: postImage ? "summary_large_image" : "summary",
		title: metaTitle,
		description: metaDescription,
		images: postImage ? [postImage] : undefined,
	  },
	  robots: isNoIndex
		? {
			index: false,
			follow: false,
		  }
		: undefined,
	  lastModified: post.updatedAt
		? new Date(post.updatedAt).toISOString().substring(0, 10)
		: undefined,
	};

	// Ajout de la balise Adsense si le slug correspond
	if (slugsWithMeta.includes(params.slug)) {
	  metadata.other = {
		"google-adsense-account": "ca-pub-3853373332492086",
	  };
	}

	// Ajout de balises meta supplémentaires (par exemple des mots-clés pour le test)
	metadata.other = {
	  ...(metadata.other || {}), // Conserve les autres balises personnalisées
	  keywords: ["Next.js", "React", "JavaScript"],
	};

	return metadata;
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
    if (section.type === "set" && section.sets.length > 0) {
      return (
        <div
          key={section.id}
          id={`${slugifyTitle(section.title)}`}
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            {/* Affiche le bouton d'édition uniquement si l'utilisateur a le rôle adéquat */}
            <EditSectionButton sectionId={section.id} postId={post.id}/>
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
            <SetSection key={setIndex}
			  id={set.id}
			  date={section.updatedAt ? new Date(section.updatedAt).toLocaleDateString("en-US", {day: "numeric", month: "long", year: "numeric",}) : "Unknown Date"}
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
		  <EditSectionButton sectionId={section.id} postId={post.id}/>
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
  const isCodesPage = slug === "legend-of-mushrooms-codes";

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

  const pageUrl = `${SITE_URL}/posts/${slug}`;
  const logoUrl = `${SITE_URL}/images/noobshroom-full-logo.png`;
  const pageJsonLd = post
    ? slug === "contact-us"
      ? {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: post.title,
          description: post.desc,
          url: pageUrl,
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }
      : slug === "about-us"
      ? {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: post.title,
          description: post.desc,
          url: pageUrl,
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }
      : slug === "privacy-policy"
      ? {
          "@context": "https://schema.org",
          "@type": "PrivacyPolicy",
          name: post.title,
          description: post.desc,
          url: pageUrl,
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }
      : slug === "terms"
      ? {
          "@context": "https://schema.org",
          "@type": "TermsOfService",
          name: post.title,
          description: post.desc,
          url: pageUrl,
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }
      : null
    : null;
  const jsonLd = post
    ? pageJsonLd || {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.desc,
        url: pageUrl,
        datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
        image: post.imgBig || post.img ? `${SITE_URL}/images/${post.imgBig || post.img}` : undefined,
        author: post.user?.name
          ? { "@type": "Person", name: post.user.name }
          : { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: logoUrl,
          },
        },
      }
    : null;

  return (
    <div className={styles.container}>
      {jsonLd ? (
        <Script
          id="post-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      {isCodesPage ? (
        <Script
          id="copy-code-buttons"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (() => {
              const handler = (event) => {
                const button = event.target.closest('[data-copy-code]');
                if (!button) return;
                const code = button.getAttribute('data-copy-code');
                if (!code || !navigator.clipboard) return;
                navigator.clipboard.writeText(code).then(() => {
                  button.classList.add('is-copied');
                  window.setTimeout(() => button.classList.remove('is-copied'), 1200);
                }).catch(() => {});
              };
              document.addEventListener('click', handler);
            })();
          `,
          }}
        />
      ) : null}
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
          <h4>Table of Contents</h4>
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
