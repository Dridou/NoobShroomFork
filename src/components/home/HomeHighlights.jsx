import Image from "next/image";
import Link from "next/link";
import prisma from "@/utils/connect";
import { EXCLUDED_CATEGORIES } from "@/utils/appConstants";
import { HOME_UPDATES } from "@/utils/homeUpdates";
import styles from "./homeHighlights.module.css";

const getRecentPosts = async () => {
  const posts = await prisma.post.findMany({
    where: {
      catSlug: {
        notIn: EXCLUDED_CATEGORIES,
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      img: true,
      imgBig: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return posts.map((post) => ({
    ...post,
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : "",
    createdAt: post.createdAt ? post.createdAt.toISOString() : "",
  }));
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const HomeHighlights = async () => {
  const posts = await getRecentPosts();

  return (
    <section className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.updates}>
          <div className={styles.headerRow}>
            <h2 className={styles.heading}>Updates</h2>
            <span className={styles.subheading}>Simple, transparent notes</span>
          </div>
          {HOME_UPDATES.length ? (
            <ul className={styles.updateList}>
              {HOME_UPDATES.slice(0, 3).map((update) => (
                <li key={update.id} className={styles.updateItem}>
                  <span>{update.text}</span>
                  {update.href ? (
                    <Link href={update.href} className={styles.updateLink}>
                      {update.linkLabel || "Read more"}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyState}>No updates yet.</p>
          )}
        </div>
        <div className={styles.articles}>
          <h2 className={styles.heading}>New / Updated Articles</h2>
          <div className={styles.articleList}>
            {posts.map((post) => {
              const imageSrc = post.img || post.imgBig;
              const lastUpdate = post.updatedAt || post.createdAt;

              return (
                <Link
                  href={`/posts/${post.slug}`}
                  className={styles.articleItem}
                  key={post.id}
                >
                  {imageSrc ? (
                    <div className={styles.articleImage}>
                      <Image
                        src={`/images/${imageSrc}`}
                        alt=""
                        fill
                        sizes="72px"
                        className={styles.articleImg}
                      />
                    </div>
                  ) : (
                    <div className={styles.articlePlaceholder}>
                      {post.title ? post.title.slice(0, 1) : "N"}
                    </div>
                  )}
                  <div className={styles.articleText}>
                    <span className={styles.articleTitle}>{post.title}</span>
                    <span className={styles.articleDate}>
                      {lastUpdate ? `Updated ${formatDate(lastUpdate)}` : ""}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHighlights;