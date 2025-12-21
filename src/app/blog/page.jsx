import CardList from "@/components/cardList/CardList";
import styles from "./blogPage.module.css";
import Menu from "@/components/Menu/Menu";
import Script from "next/script";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/utils/seo";

export const generateMetadata = ({ searchParams }) => {
  const { cat } = searchParams;
  const catLabel = cat ? cat.replace("-", " ") : "All posts";
  const title = `Blog - ${catLabel}`;
  const url = cat ? `${SITE_URL}/blog?cat=${encodeURIComponent(cat)}` : `${SITE_URL}/blog`;

  return {
    title,
    description: `Browse ${catLabel} on NoobShroom. ${DEFAULT_DESCRIPTION}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title,
      description: `Browse ${catLabel} on NoobShroom. ${DEFAULT_DESCRIPTION}`,
    },
    twitter: {
      card: "summary",
      title,
      description: `Browse ${catLabel} on NoobShroom. ${DEFAULT_DESCRIPTION}`,
    },
  };
};

const BlogPage = ({ searchParams }) => {
  const { cat } = searchParams;
  const catLabel = cat ? cat.replace("-", " ") : "All posts";
  const url = cat
    ? `${SITE_URL}/blog?cat=${encodeURIComponent(cat)}`
    : `${SITE_URL}/blog`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Blog - ${catLabel}`,
    description: `Browse ${catLabel} on NoobShroom. ${DEFAULT_DESCRIPTION}`,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <div className={styles.container}>
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{catLabel}</h1>
      </div>
      <div className={styles.content}>
        <CardList cat={cat} />
        <Menu />
      </div>
    </div>
  );
};

export default BlogPage;
