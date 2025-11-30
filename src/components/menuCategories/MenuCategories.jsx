import Link from "next/link";
import React from "react";
import styles from "./menuCategories.module.css";
import { getBaseUrl } from "@/utils/getBaseUrl";

const getData = async () => {
  const res = await fetch(`${getBaseUrl()}/api/categories`);

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const MenuCategories = async () => {
  const data = await getData();
  return (
    <div className={styles.categoryList}>
      {data?.map((cat) => (
        <Link
          href={`/blog?cat=${cat.slug}`}
          className={`${styles.category} ${styles[cat.slug]}`}
          key={cat._id}
        >
          {cat.title}
        </Link>
      ))}
    </div>
  );
};

export default MenuCategories;
