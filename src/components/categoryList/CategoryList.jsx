import React from "react";
import styles from "./categoryList.module.css";
import Link from "next/link";
import Image from "next/image";

const getBaseUrl = () => {return "https://www.noobshroom.com" };

const getData = async () => {
  const baseUrl = getBaseUrl();
  console.log("Fetching from URL:", baseUrl); // Log the URL
  const res = await fetch(`${baseUrl}/api/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const CategoryList = async () => {
  const data = await getData();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Popular Categories</h1>
      <div className={styles.categories}>
        {data?.map((cat) => (
          <Link
            href={`/blog?cat=${cat.slug}`}
            className={`${styles.category} ${styles[cat.slug]}`}
            key={cat._id}
          >
            {cat.img && (
              <Image
                src={cat.img}
                alt=""
                width={768}
                height={256}
                className={styles.image}
              />
            )}
            <div className={styles.catTitle}>{cat.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
