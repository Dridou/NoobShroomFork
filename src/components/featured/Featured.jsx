import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";

const getBaseUrl = () => {
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.noobshroom.com";
  } else if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  } else {
    return "https://www.noobshroom.com";
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
        <b>Your ultimate Legend of Mushroom reference</b>
      </h1>
      <h2 className={styles.subtitle}>
        <i>
          Most <b>in-depth guides</b> by the most <b>experienced players</b>.
        </i>
      </h2>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image
            src="/images/shops-banner.png"
            alt=""
            width={520}
            height={210}
            className={styles.image}
          />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>
            <b>What to buy in shops ?</b>
          </h1>
          <p className={styles.postDesc}>
		  Have you ever wondered <span className={styles.tips}>what you should buy first</span> in the Family Shop, the Brawl Shop or during events ?<br /><br />I tried my best to make this guide <span className={styles.tips}>easy to follow</span>, and I truly hope it helps you on your journey to becoming a better player.
          </p>
          <button className={styles.button}>
            <a href={"/posts/what-to-buy-in-shops"}>
              Read more
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
