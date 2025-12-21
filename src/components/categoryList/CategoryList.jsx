import React from "react";
import styles from "./categoryList.module.css";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/utils/connect";

const getData = async () => {
  const excludedCategories = ["legal", "database"];

  return prisma.category.findMany({
    where: {
      slug: {
        notIn: excludedCategories,
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      img: true,
    },
  });
};

const CategoryList = async () => {
  const data = await getData();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Categories</h2>
      <div className={styles.categories}>
        {data?.map((cat) => (
          <Link
            href={`/blog?cat=${cat.slug}`}
            className={`${styles.category} ${styles[cat.slug]}`}
            key={cat.id}
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
