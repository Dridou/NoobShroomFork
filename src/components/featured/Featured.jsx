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

const Featured = async () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Your ultimate Legend of Mushroom reference</b>
      </h1>
      <span className={styles.subtitle}>
        <i>
          Most <b>in-depth guides</b> by the most <b>experienced players</b>.
        </i>
      </span>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image
            src="/images/prophet-character.png"
            alt="Prophet Character"
            width={512}
            height={512}
            className={styles.image}
          />
        </div>
        <div className={styles.textContainer}>
          <span className={styles.postTitle}>
            <b>How to play Prophet as a regeneration Tank ?</b>
          </span>
          <p className={styles.postDesc}>
			The Prophet is a mage class that can be played as a tank with the
			right build.<br/>
			This guide will show you how to play the Prophet as a
			regeneration tank which is in <span class="tips">this meta a really strong pick</span> !
          </p>
          <button className={styles.button}>
            <a href={"/posts/mage-prophet-tank-regen"}>Prophet regen build</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
