"use client";

import styles from "./featured.module.css";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const Featured = () => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/posts/prophet-preblitz-class-guide"
        );
        if (!res.ok) {
          throw new Error("Post not found");
        }
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Your ultimate Legend of Mushrooms reference</b>
      </h1>
      <h2 className={styles.subtitle}>
        Most <b>in-depth guides</b> by the most <b>experienced players</b>.
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
            Discover all the knowledge acumulated by the best Prophet players,
            avoid mistakes and learn from the best how to play your pre-blitz
            Prophet!
          </p>
          <button className={styles.button}>
            <a href="http://localhost:3000/posts/prophet-preblitz-class-guide">
              Read more
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
