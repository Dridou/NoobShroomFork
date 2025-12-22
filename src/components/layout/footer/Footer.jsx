import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.bmcContainer}>
          <div>
            <Link
              href="https://www.buymeacoffee.com/NoobShroom"
              target="_blank"
              className={styles.bmcButton}
            >
              <Image
                src="/images/bmc-logo.png"
                alt="Buy me a coffee Logo"
                width={30}
                height={30}
                className={styles.discordLogo}
              />
              <span className={styles.bmcText}>Buy me a coffee</span>
            </Link>
          </div>
          <p className={styles.paragraphText}>
            Ever been <span className={styles.important}>helped by my content?</span> Support us by buying us a coffee!
          </p>
        </div>
        <div className={styles.discord}>
          <div className={styles.discordContainer}>
            <div className={styles.discordButton}>
              <Image
                src="/images/icon_discord.png"
                alt="Discord Logo"
                width={40}
                height={30}
                className={styles.discordLogo}
              />
              <Link
                href="https://discord.gg/V8FzGSQyer"
                className={styles.discordText}
              >
                Join NoobShroom Community !
              </Link>
            </div>
            <p className={styles.paragraphText}>
              Connect with other legend of mushroom enthusiasts and get the
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
