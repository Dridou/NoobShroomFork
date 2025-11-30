import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

const Card = ({ item }) => {
  return (
    <div className={styles.container}>
      {item.imgBig && (
        <div className={styles.imageContainer}>
          <Image
            src={`/images/${item.imgBig}`}
            alt=""
            width={493}
            height={511}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.textContainer}>
        <Link href={`/posts/${item.slug}`}>
          <div className={styles.detail}>
            <span className={styles.date}>
              {item.createdAt.substring(0, 10)} -{" "}
            </span>
            <span className={styles.category}>{item.catSlug}</span>
          </div>
        </Link>
        <h3 className={styles.title}>{item.title}</h3>

        <div className={styles.postContent}>
          <div className={styles.descContent}>
            <div
              className={styles.desc}
              dangerouslySetInnerHTML={{
                __html: item?.desc.substring(0, 450) + "...",
              }}
            />
            <Link href={`/posts/${item.slug}`} className={styles.link}>
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
