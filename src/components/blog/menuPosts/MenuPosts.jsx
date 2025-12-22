import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./menuPosts.module.css";
import prisma from "@/utils/connect";
import { EXCLUDED_CATEGORIES } from "@/utils/appConstants";

const getData = async () => {
  const posts = await prisma.post.findMany({
    where: {
      catSlug: {
        notIn: EXCLUDED_CATEGORIES,
      },
    },
    orderBy: { views: "desc" },
    take: 5,
    select: {
      id: true,
      slug: true,
      img: true,
      title: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return { posts, count: posts.length };
};

const MenuPosts = async () => {
  const { posts, count } = await getData();
  return (

    <div className={styles.items}>
      {posts?.map((post) => (
        <Link
          href={`/posts/${post.slug}`}
          className={styles.item}
          key={post.id}
        >
          <div className={styles.imageContainer}>
            <Image
              src={`/images/${post.img}`}
              alt=""
              fill
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <div className={styles.detail}>
              <span className={styles.username}>{post.user.name}</span>
              <span className={styles.date}> - 10.03.2023</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPosts;
