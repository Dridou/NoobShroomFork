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

  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt ? post.createdAt.toISOString() : "",
  }));

  return { posts: serializedPosts, count: serializedPosts.length };
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
