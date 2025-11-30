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
    return "https://www.noobshroom.com";
  }
};

const getData = async () => {
  const baseUrl = getBaseUrl();
  let res = null;
  try {
    res = await fetch(`${baseUrl}/api/posts?sortBy=createdAt`);
  } catch (error) {
	console.error("Failed to fetch posts XXX", baseUrl);
	throw new Error("Failed to fetch posts");
  }

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error("Fetch failed:", errorDetails);
    throw new Error("Failed to fetch posts");
  }

  return res.json();
};

const isPostReady = (post) => {
  return true;
};

const CardList = async () => {
  const { posts, count } = await getData();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recent Posts</h2>
      <hr className={styles.divider} />
      <div className={styles.posts}>
        {posts?.map((item) => ( isPostReady(item) && (
          <Card item={item} key={item._id} />)
        ))}
      </div>
    </div>
  );
};

export default CardList;
