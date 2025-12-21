import React from "react";
import styles from "./cardList.module.css";
import Card from "../card/Card";
import prisma from "@/utils/connect";

const getData = async () => {
  const excludedCategories = ["legal", "database"];

  const posts = await prisma.post.findMany({
    where: {
      catSlug: {
        notIn: excludedCategories,
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      title: true,
      desc: true,
      imgBig: true,
      createdAt: true,
      catSlug: true,
    },
  });

  return { posts, count: posts.length };
};

const isPostReady = (post) => {
  return true;
};

const CardList = async () => {
  const { posts, count } = await getData();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recent Posts</h2>
      <hr className={styles.divider} />
      <div className={styles.posts}>
        {posts?.map((item) => ( isPostReady(item) && (
          <Card item={item} key={item._id} />)
        ))}
      </div>
    </div>
  );
};

export default CardList;
