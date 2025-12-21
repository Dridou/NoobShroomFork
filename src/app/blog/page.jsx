import CardList from "@/components/cardList/CardList";
import styles from "./blogPage.module.css";
import Menu from "@/components/Menu/Menu";
import { SITE_URL } from "@/utils/seo";

export const generateMetadata = ({ searchParams }) => {
  const { cat } = searchParams;
  const catLabel = cat ? cat.replace("-", " ") : "All posts";
  const title = `Blog - ${catLabel}`;
  const url = cat ? `${SITE_URL}/blog?cat=${encodeURIComponent(cat)}` : `${SITE_URL}/blog`;

  return {
    title,
    description: `Browse ${catLabel} on NoobShroom.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title,
      description: `Browse ${catLabel} on NoobShroom.`,
    },
    twitter: {
      card: "summary",
      title,
      description: `Browse ${catLabel} on NoobShroom.`,
    },
  };
};

const BlogPage = ({ searchParams }) => {
  const { cat } = searchParams;
  const catLabel = cat ? cat.replace("-", " ") : "All posts";

  return (
    <div className={styles.container}>
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
