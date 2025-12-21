// app/page.jsx
import styles from "./homepage.module.css";
import Featured from "@/components/featured/Featured";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";
import Script from "next/script";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/utils/seo";

export const metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function Home({ searchParams }) {
	const page = parseInt(searchParams.page) || 1;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

	return (
	  <div className={styles.container}>
      <Script
        id="home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
		<Featured />
		<div className={styles.content}>
		  <CardList page={page}/>
		  <Menu />
		</div>
	  </div>
	);
}
