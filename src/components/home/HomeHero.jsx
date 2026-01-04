import styles from "./homeHero.module.css";
import { HOME_BANNER } from "@/utils/homeBanner";

const getBannerLines = (message) => {
  if (!message) {
    return [];
  }
  const normalized = String(message).replace(/<br\s*\/?>/gi, "\n");
  return normalized.split(/\r?\n/);
};

const HomeHero = () => {
  const bannerLines = getBannerLines(HOME_BANNER?.message);

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        <b>Your ultimate Legend of Mushroom reference</b>
      </h1>
      <span className={styles.subtitle}>
        <i>
          Most <b>in-depth guides</b> by the most <b>experienced players</b>.
        </i>
      </span>
      {bannerLines.length ? (
        <div className={styles.banner}>
          <span className={styles.bannerLabel}>{HOME_BANNER.title}</span>
          <p className={styles.bannerText}>
            {bannerLines.map((line, index) => (
              <span key={`banner-line-${index}`}>
                {line}
                {index < bannerLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>
      ) : null}
    </section>
  );
};

export default HomeHero;