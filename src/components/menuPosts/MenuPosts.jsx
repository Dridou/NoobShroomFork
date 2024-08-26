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

const getData = async () => {
	const baseUrl = getBaseUrl();
	const res = await fetch(
	  `${baseUrl}/api/posts?sortBy=views`
	);

	if (!res.ok) {
	  const errorDetails = await res.text();
	  console.error("Fetch failed:", errorDetails);
	  throw new Error("Failed to fetch posts");
	}

	return res.json();
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
