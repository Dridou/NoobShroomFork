import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";

const getBaseUrl = () => {
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.noobshroom.com";
  } else if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  } else {
    return "http://localhost:3000";
  }
};

const getPostData = async () => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts/prophet-preblitz-class-guide`);
  if (!res.ok) {
    const errorDetails = await res.text();
    console.error("Fetch failed:", errorDetails);
    throw new Error("Failed to fetch post");
  }
  return res.json();
};

const Featured = async () => {
  const post = await getPostData();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Your ultimate Legend of Mushrooms reference</b>
      </h1>
      <h2 className={styles.subtitle}>
        <i>
          Most <b>in-depth guides</b> by the most <b>experienced players</b>.
        </i>
      </h2>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image
            src="/images/prophet-character.png"
            alt=""
            width={512}
            height={512}
            className={styles.image}
          />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>
            <b>{post?.title}</b>
          </h1>
          <p className={styles.postDesc}>
            {post?.description ||
              `Discover all the knowledge accumulated by the best Prophet players, avoid mistakes and learn from the best how to play your pre-blitz Prophet!`}
          </p>
          <button className={styles.button}>
            <a href={`/posts/${post?.slug || "prophet-preblitz-class-guide"}`}>
              Read more
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
