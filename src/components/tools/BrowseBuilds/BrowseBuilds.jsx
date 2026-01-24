"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./BrowseBuilds.module.css";

const TAGS = ["PvE", "PvP", "F2P", "Whale"];
const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest" },
  { value: "likes", label: "Most Liked" },
  { value: "dislikes", label: "Most Disliked" },
];

export default function BrowseBuilds() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(null);

  // Fetch builds
  const fetchBuilds = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      if (selectedTag) params.append("tag", selectedTag);
      if (search) params.append("search", search);

      const response = await fetch(`/api/builder/talents/browse?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch builds");
      }

      setBuilds(data.builds);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to page 1 when filters change
  }, [selectedTag, sortBy, sortOrder, search]);

  useEffect(() => {
    fetchBuilds();
  }, [page, limit, selectedTag, sortBy, sortOrder, search]);

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleSort = (newSort) => {
    if (sortBy === newSort) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(newSort);
      setSortOrder("desc");
    }
  };

  const getRatingPercentage = (likes, dislikes) => {
    const total = likes + dislikes;
    if (total === 0) return 50;
    return Math.round((likes / total) * 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Browse Talent Builds</h1>
        <p>Explore builds created by the community</p>
      </div>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search by name or creator..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Filters and Sort */}
      <div className={styles.filterSection}>
        <div className={styles.tagFilters}>
          <span className={styles.filterLabel}>Tags:</span>
          {TAGS.map((tag) => (
            <button
              key={tag}
              className={`${styles.tagButton} ${
                selectedTag === tag ? styles.active : ""
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
          {selectedTag && (
            <button
              className={styles.clearButton}
              onClick={() => setSelectedTag(null)}
            >
              Clear
            </button>
          )}
        </div>

        <div className={styles.sortSection}>
          <span className={styles.filterLabel}>Sort by:</span>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.sortButton} ${
                sortBy === option.value ? styles.active : ""
              }`}
              onClick={() => handleSort(option.value)}
            >
              {option.label}
              {sortBy === option.value && (
                <span className={styles.sortIcon}>
                  {sortOrder === "desc" ? " ↓" : " ↑"}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {pagination && (
        <div className={styles.resultInfo}>
          Showing {builds.length} of {pagination.total} builds
        </div>
      )}

      {/* Builds Grid */}
      {loading ? (
        <div className={styles.loading}>Loading builds...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : builds.length === 0 ? (
        <div className={styles.empty}>No builds found</div>
      ) : (
        <div className={styles.buildsGrid}>
          {builds.map((build) => {
            const rating = getRatingPercentage(build.likes, build.dislikes);
            const totalVotes = build.likes + build.dislikes;

            return (
              <Link
                href={`/builder/talents/view/${build.id}`}
                key={build.id}
                className={styles.buildCard}
              >
                <div className={styles.cardContent}>
                  <div className={styles.buildInfo}>
                    <h3 className={styles.buildName}>
                      {build.name || "Unnamed Build"}
                    </h3>
                    <p className={styles.creator}>
                      by {build.creatorName || "Anonymous"}
                    </p>
                  </div>

                  <div className={styles.voteSection}>
                    <div className={styles.voteCount}>
                      <span className={styles.like}>👍 {build.likes}</span>
                      <span className={styles.dislike}>
                        👎 {build.dislikes}
                      </span>
                    </div>

                    {totalVotes > 0 && (
                      <div className={styles.ratingBar}>
                        <div
                          className={styles.ratingFill}
                          style={{
                            width: `${rating}%`,
                            backgroundColor: rating > 50 ? "#4caf50" : "#f44336",
                          }}
                        />
                        <span className={styles.ratingText}>{rating}%</span>
                      </div>
                    )}
                  </div>

                  {build.tags && build.tags.length > 0 && (
                    <div className={styles.tags}>
                      {build.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.date}>
                    {new Date(build.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={styles.paginationBtn}
          >
            ← Previous
          </button>

          <div className={styles.pageInfo}>
            Page {page} of {pagination.totalPages}
          </div>

          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page === pagination.totalPages}
            className={styles.paginationBtn}
          >
            Next →
          </button>
        </div>
      )}

      {/* Limit selector */}
      <div className={styles.limitSelector}>
        <label>Items per page:</label>
        <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
}
