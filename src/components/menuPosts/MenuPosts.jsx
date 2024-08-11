import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./menuPosts.module.css";

const getBaseUrl = () => {
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.noobshroom.com";
  } else if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  } else {
    return "http://localhost:3000";
  }
};

export const getPopularPosts = async () => {

  const baseUrl = getBaseUrl();
  console.log("Fetching from URL:", baseUrl); // Log the URL
  const res = await fetch(`${baseUrl}/api/posts?sortBy=views`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
};

const MenuPosts = async () => {
  const { posts, count } = await getPopularPosts();
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
            {/* <span className={styles.classGuide}>{post.catSlug}</span> */}
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
