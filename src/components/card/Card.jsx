import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

const Card = ({ key, item }) => {
  return (
    <div className={styles.container} key={key}>
      <div className={styles.textContainer}>
        <Link href={`/posts/${item.slug}`}>
          <h1>{item.title}</h1>
          <div className={styles.detail}>
            <span className={styles.date}>
              {item.createdAt.substring(0, 10)} -{" "}
            </span>
            <span className={styles.category}>{item.catSlug}</span>
          </div>
        </Link>
        <div>
          <Link href={`/posts/${item.slug}`} className={styles.link}>
            <div
              className={styles.desc}
              dangerouslySetInnerHTML={{
                __html: item?.desc.substring(0, 150) + "...",
              }}
            />
            <br></br>
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
