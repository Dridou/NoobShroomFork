import React from "react";
import styles from "./cardList.module.css";
import Pagination from "../pagination/Pagination";
import Image from "next/image";
import Card from "../card/Card";

const getBaseUrl = () => {
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.noobshroom.com";
  } else if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  } else {
    return "http://localhost:3000";
  }
};

const getData = async (page, cat) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(
    `${baseUrl}/api/posts?page=${page}&cat=${cat || ""}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error("Fetch failed:", errorDetails);
    throw new Error("Failed to fetch posts");
  }

  return res.json();
};

const CardList = async ({ page, cat }) => {
  const { posts, count } = await getData(page, cat);

  const POST_PER_PAGE = 3;

  const hasPrev = POST_PER_PAGE * (page - 1) > 0;
  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <hr className={styles.divider} />
      <div className={styles.posts}>
        {posts?.map((item) => (
          <Card item={item} key={item._id} />
        ))}
      </div>
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
};

export default CardList;
