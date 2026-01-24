"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { showToast } from "@/utils/toast";
import styles from "./VoteButtons.module.css";

const TIMEOUT_MS = 5000; // 5 seconds timeout

/**
 * VoteButtons component with optimistic updates
 * 
 * State management:
 * - likes, dislikes: current displayed counts
 * - userVote: 1 (like), -1 (dislike), null (no vote)
 * - isVoting: whether a request is in flight
 * - pendingVote: last intention if user clicked during isVoting
 */
export default function VoteButtons({
  buildId,
  initialLikes = 0,
  initialDislikes = 0,
  initialUserVote = null,
  onError = null,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);

  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  /**
   * Apply optimistic update to state
   */
  const applyOptimistic = useCallback((targetVote) => {
    setLikes((prev) => {
      setDislikes((prevD) => {
        // Same vote clicked again -> toggle off
        if (userVote === targetVote) {
          return prevD + (userVote === -1 ? 1 : 0);
        }

        // First vote or switching votes
        const newLikes =
          prev +
          (targetVote === 1 ? 1 : 0) +
          (userVote === 1 ? -1 : 0);
        const newDislikes =
          prevD +
          (targetVote === -1 ? 1 : 0) +
          (userVote === -1 ? -1 : 0);

        setLikes(newLikes);
        return newDislikes;
      });

      return prev + (targetVote === 1 ? 1 : 0) + (userVote === 1 ? -1 : 0);
    });

    setUserVote((prev) => (prev === targetVote ? null : targetVote));
  }, [userVote]);

  /**
   * Rollback state if vote fails
   */
  const rollback = useCallback(
    (prevLikes, prevDislikes, prevUserVote) => {
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setUserVote(prevUserVote);
    },
    []
  );

  /**
   * Handle vote submission
   */
  const submitVote = useCallback(
    async (targetVote) => {
      if (!buildId) {
        showToast("Save the build to enable votes.", "warning");
        if (onError) onError("Build not saved yet");
        return;
      }

      // Save previous state for rollback
      const prevLikes = likes;
      const prevDislikes = dislikes;
      const prevUserVote = userVote;

      // Apply optimistic update
      applyOptimistic(targetVote);
      setIsVoting(true);
      setPendingVote(null);

      // Setup request timeout
      abortControllerRef.current = new AbortController();
      timeoutRef.current = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, TIMEOUT_MS);

      try {
        const response = await fetch(
          `/api/builder/talents/${buildId}/vote`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vote: targetVote }),
            signal: abortControllerRef.current.signal,
          }
        );

        clearTimeout(timeoutRef.current);

        const data = await response.json();

        if (response.ok) {
          // Update with server response (source of truth)
          setLikes(data.likes);
          setDislikes(data.dislikes);
          setUserVote(data.userVote);

          // If there's a pending vote, submit it immediately
          if (pendingVote !== null) {
            setPendingVote(null);
            setIsVoting(false);
            // Delay to allow UI to settle
            setTimeout(() => submitVote(pendingVote), 0);
            return;
          }
        } else if (response.status === 429) {
          // Rate limited
          rollback(prevLikes, prevDislikes, prevUserVote);
          const retryAfter = data.retryAfter || 60;
          const errorMsg = `Too many votes. Try again in ${retryAfter} seconds.`;
          showToast(errorMsg, "warning");
          if (onError) onError(errorMsg);
        } else {
          // Other error
          rollback(prevLikes, prevDislikes, prevUserVote);
          const errorMsg = data.error || "Failed to vote";
          showToast(errorMsg, "error");
          if (onError) onError(errorMsg);
        }
      } catch (error) {
        // Timeout or network error
        rollback(prevLikes, prevDislikes, prevUserVote);

        if (error.name === "AbortError") {
          const errorMsg = "Request timed out. Please try again.";
          showToast(errorMsg, "error");
          if (onError) onError(errorMsg);
        } else {
          const errorMsg = "Network error. Please try again.";
          showToast(errorMsg, "error");
          if (onError) onError(errorMsg);
        }
      } finally {
        setIsVoting(false);
      }
    },
    [buildId, likes, dislikes, userVote, pendingVote, applyOptimistic, rollback, onError]
  );

  /**
   * Handle button click
   */
  const handleClick = useCallback(
    (targetVote) => {
      if (isVoting) {
        // Store intention, will be processed after current request
        setPendingVote(targetVote);
        return;
      }

      submitVote(targetVote);
    },
    [isVoting, submitVote]
  );

  return (
    <div className={styles.voteContainer}>
      <button
        type="button"
        className={`${styles.voteButton} ${styles.likeButton} ${
          userVote === 1 ? styles.active : ""
        }`}
        onClick={() => handleClick(1)}
        disabled={isVoting}
        title={isVoting ? "Voting..." : "Like"}
      >
        <span className={styles.thumbsUp}>👍</span>
        <span className={styles.count}>{likes}</span>
      </button>

      <button
        type="button"
        className={`${styles.voteButton} ${styles.dislikeButton} ${
          userVote === -1 ? styles.active : ""
        }`}
        onClick={() => handleClick(-1)}
        disabled={isVoting}
        title={isVoting ? "Voting..." : "Dislike"}
      >
        <span className={styles.thumbsDown}>👎</span>
        <span className={styles.count}>{dislikes}</span>
      </button>
    </div>
  );
}
