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
            src="/images/update-image.webp"
            alt=""
            width={594}
            height={335}
            className={styles.image}
          />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>
            <b>Update Septembre 4th : New class - Spirit Channeler and adjustements</b>
          </h1>
          <p className={styles.postDesc}>
		  Discover everything you need to know about the exciting <span class="tips">new update</span> in Legend of Mushroom! The new <span class="tips">Spirit Channeler class</span> is here, bringing a complete overhaul to game balance, including major adjustments to Pals, Relics, Accessory Talents, and more.<br/><br/>In our <span class="tips">preliminary analysis</span>, we dive into the details of these changes and explore their potential impact on gameplay.<br/><br/><span class="tips">Follow our ongoing analysis</span> to stay up-to-date and understand how these adjustments might shake up your favorite strategies! Stay tuned for real-time updates and in-depth guides!
          </p>
          <button className={styles.button}>
            <a href={"/posts/update-new-class"}>
              Read more
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
