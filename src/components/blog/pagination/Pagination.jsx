"use client";

import React from "react";
import styles from "./pagination.module.css";
import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({ page, hasPrev, hasNext }) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // To access the current search params

  const cat = searchParams.get('cat'); // Get the current 'cat' parameter

  const getNextUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams); // Clone current search params
    params.set('page', pageNumber); // Update the page parameter
    if (cat) params.set('cat', cat); // Make sure to keep the 'cat' parameter
    return `?${params.toString()}`;
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={!hasPrev}
        onClick={() => router.push(getNextUrl(page - 1))}
      >
        Previous
      </button>
      <button
        disabled={!hasNext}
        className={styles.button}
        onClick={() => router.push(getNextUrl(page + 1))}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
