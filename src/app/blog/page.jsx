import CardList from "@/components/cardList/CardList";
import styles from "./blogPage.module.css";
import Menu from "@/components/Menu/Menu";

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
