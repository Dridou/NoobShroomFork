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
            src="/images/beastmaster/beast-masters-characters.png"
            alt="Beast master characters"
            width={493}
            height={511}
            className={styles.image}
          />
        </div>
        <div className={styles.textContainer}>
          <span className={styles.postTitle}>
            <b>New class: Beast master - Discover our in-depth class guide</b>
          </span>
          <p className={styles.postDesc}>
            Following the <span class="tips">new update</span> of Legend of
            Mushroom you can now play the new{" "}
            <span class="tips">Beastmaster</span> class.
            <br />
            <br />
            In our <span class="tips">in-depth guide</span>, we dive into the
            details of this new class and tell you the best up to date way to
            play it!.
            <br />
            <br />
            <span class="tips">Follow our ongoing guide</span> to stay
            up-to-date and become the best Beastmaster in the game!
          </p>
          <button className={styles.button}>
            <a href={"/posts/beast-master-class-guide"}>Beast Master guide</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
