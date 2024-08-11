import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.logo}>
            <Image
              src="/images/noobshroom-full-logo.png"
              alt="noobshroom Logo"
              width={200}
              height={45}
            />
          </div>
          <p className={styles.desc}>
            Created to help you find the most accurate and up-to-date
            information about the game Legend of Mushrooms, including the latest
            news, updates, and guides.
          </p>
        </div>
        <div className={styles.discord}>
          <div className={styles.discordContainer}>
            <div className={styles.discordButton}>
              <Image
                src="/images/icon_discord.png"
                alt="Discord Logo"
                width={30}
                height={23}
                className={styles.discordLogo}
              />
              <Link href="https://discord.gg/BtwdhuBk" target="_blank" className={styles.discordText}>Join NoobShroom Community !</Link>
            </div>
            <p className={styles.discordText}>
              Connect with other Legend of Mushrooms enthusiasts and get the
              latest news and updates.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.yo}>
        <div className={styles.links}>
          <Link href="/posts/about-us" className={styles.link}>
            About Us
          </Link>
          <Link href="/posts/contact-us" className={styles.link}>
            Contact Us
          </Link>
          <Link href="/posts/source-credit" className={styles.link}>
            Source & Credit
          </Link>
          <Link href="/posts/privacy-policy" className={styles.link}>
            Privacy Policy
          </Link>
          <Link href="/posts/terms" className={styles.link}>
            Terms of Use
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
