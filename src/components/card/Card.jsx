import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

const Card = ({ item }) => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1>{item.title}</h1>
        <Link href={`/posts/${item.slug}`}>
          <div className={styles.detail}>
            <span className={styles.date}>
              {item.createdAt.substring(0, 10)} -{" "}
            </span>
            <span className={styles.category}>{item.catSlug}</span>
          </div>
        </Link>
        <div>
          <div
            className={styles.desc}
            dangerouslySetInnerHTML={{
              __html: item?.desc.substring(0, 150) + "...",
            }}
          />
          <Link href={`/posts/${item.slug}`} className={styles.link}>
            Read More
          </Link>
        </div>
      </div>
      {item.imgBig && (
        <div className={styles.imageContainer}>
          <Image
            src={`/images/${item.imgBig}`}
            alt=""
            width={300}
            height={300}
            className={styles.image}
          />
        </div>
      )}
    </div>
  );
};

export default Card;
