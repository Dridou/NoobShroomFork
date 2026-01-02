// src/app/posts/[slug]/page.js

import Image from "next/image";
import Script from "next/script";
import styles from "./singlePage.module.css";
import CardList from "@/components/blog/cardList/CardList";
import Menu from "@/components/blog/Menu/Menu";
import Comments from "@/components/blog/comments/Comments";
import "../../styles/colStyles.css";
import "../../styles/tableStyles.css";

import dynamic from "next/dynamic";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  isNoIndexSlug,
} from "@/utils/seo";
import { slugifyTitle } from "./helpers";
import {
  fetchPostData,
  fetchPostSlugs,
  fetchRedeemCodes,
  fetchShopsData,
  fetchUpdatesData,
} from "./data";
import {
  renderCodesContent,
  renderSectionsContent,
  renderShopsSection,
  renderUpdatesSection,
} from "./renderers";

// Importation dynamique du composant client TalentTree
const TalentTree = dynamic(() => import("@/components/talent/TalentTree/TalentTree"), { ssr: false });

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
  return fetchPostSlugs();
}

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
	case "legend-of-mushrooms-codes":
	  post = await fetchPostData(slug);
	  const codes = await fetchRedeemCodes();
	  sectionsContent = renderCodesContent(codes);
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
