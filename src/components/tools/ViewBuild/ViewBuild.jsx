"use client";

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import Link from "next/link";
import VoteButtons from "@/components/builder/talents/VoteButtons";
import TalentBranch from "@/components/talent/TalentBranch/TalentBranch";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { TALENT_TABS, TALENT_TAB_ORDER } from "@/data/talents";
import styles from "./ViewBuild.module.css";
import builderStyles from "@/components/builder/talents/TalentBuilder.module.css";

// Helper to get all nodes from a talent tab
const TREE_WIDTH = 1350;
const TREE_HEIGHT = 1000;
const BRANCH_VIEW_WIDTH = 470;
const BRANCH_VIEW_HEIGHT = 545;

const getTabNodes = (tab) => {
  const tabData = TALENT_TABS[tab];
  return tabData?.nodes || [];
};

const buildPointsFromConfig = (config) => {
  const BRANCH_SIZE = 10;
  const buildTabPoints = (tabConfig) => {
    const pointsFromBranchConfig = (branchConfig) => {
      const points = Array.from({ length: BRANCH_SIZE }, () => 0);
      if (!branchConfig || typeof branchConfig !== "object") {
        return points;
      }
      const nodes = branchConfig.nodes || {};
      Object.entries(nodes).forEach(([index, value]) => {
        const parsedIndex = Number(index);
        if (!Number.isNaN(parsedIndex) && parsedIndex < points.length) {
          points[parsedIndex] = Number(value) || 0;
        }
      });
      return points;
    };

    const branch1 = pointsFromBranchConfig(tabConfig?.branch1);
    const branch2 = pointsFromBranchConfig(tabConfig?.branch2);
    const branch3 = pointsFromBranchConfig(tabConfig?.branch3);
    return [...branch1, ...branch2, ...branch3];
  };

  return {
    Fury: buildTabPoints(config?.fury),
    Archery: buildTabPoints(config?.archery),
    Sorcery: buildTabPoints(config?.sorcery),
    Beast: buildTabPoints(config?.tameBeasts),
  };
};

export default function ViewBuild({ buildId }) {
  const [build, setBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Fury");
  const [incrementValue, setIncrementValue] = useState(1);
  const [branchPoints, setBranchPoints] = useState({
    Fury: [],
    Archery: [],
    Sorcery: [],
    Beast: [],
  });
  const [lastAction, setLastAction] = useState(null);
  const treeWrapperRef = useRef(null);
  const [treeScale, setTreeScale] = useState(1);
  const [initialTransform, setInitialTransform] = useState({ scale: 1, x: 0, y: 0 });

  // Calculate total feathers spent
  const totalFeathersSpent = Object.values(branchPoints).reduce((acc, branch) => {
    return acc + branch.reduce((sum, points) => sum + points, 0);
  }, 0);

  const calculateTreeScale = useCallback(() => {
    const wrapper = treeWrapperRef.current;
    if (!wrapper) {
      return;
    }

    const { width, height } = wrapper.getBoundingClientRect();
    if (!width || !height) {
      return;
    }

    const baseScale = Math.min(width / TREE_WIDTH, height / TREE_HEIGHT, 1);
    const branchScale = Math.min(
      width / BRANCH_VIEW_WIDTH,
      height / BRANCH_VIEW_HEIGHT,
      1
    );
    const resolvedScale = Math.max(baseScale, branchScale);
    const finalScale = Number.isFinite(resolvedScale) ? resolvedScale : 1;
    const centeredX = (width - TREE_WIDTH * finalScale) / 2;
    const centeredY = (height - TREE_HEIGHT * finalScale) / 2;
    setTreeScale(finalScale);
    setInitialTransform({ scale: finalScale, x: centeredX, y: centeredY });
  }, []);

  useLayoutEffect(() => {
    calculateTreeScale();
    window.addEventListener("resize", calculateTreeScale);
    return () => window.removeEventListener("resize", calculateTreeScale);
  }, [calculateTreeScale]);

  const treeScaleKey = `${Math.round(initialTransform.scale * 1000)}-${Math.round(initialTransform.x)}-${Math.round(initialTransform.y)}`;

  const stopZoomEvent = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const response = await fetch(`/api/builder/talents/${buildId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load build");
        }

        setBuild(data);

        // Parse config
        if (data.config) {
          const points = buildPointsFromConfig(data.config);
          setBranchPoints(points);
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuild();
  }, [buildId]);

  // Track node investment for undo functionality
  const handleNodeInvestment = (tabName, nodeIndex, newPoints, costSpent) => {
    setLastAction({
      type: "invest",
      tab: tabName,
      nodeIndex,
      pointsAdded: newPoints,
      costSpent,
      previousPoints: branchPoints[tabName][nodeIndex],
    });
  };

  const handleResetBranch = () => {
    setLastAction({
      type: "reset",
      tab: selectedTab,
      previousPoints: branchPoints[selectedTab],
    });
    setBranchPoints((prevPoints) => ({
      ...prevPoints,
      [selectedTab]: prevPoints[selectedTab].map(() => 0),
    }));
  };

  const handleUndo = () => {
    if (!lastAction) return;

    if (lastAction.type === "reset") {
      setBranchPoints((prevPoints) => ({
        ...prevPoints,
        [lastAction.tab]: lastAction.previousPoints,
      }));
      setLastAction(null);
    } else if (lastAction.type === "invest") {
      // Undo point investment
      setBranchPoints((prevPoints) => ({
        ...prevPoints,
        [lastAction.tab]: prevPoints[lastAction.tab].map((value, index) =>
          index === lastAction.nodeIndex ? lastAction.previousPoints : value
        ),
      }));
      setLastAction(null);
    }
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading build...</div></div>;
  }

  if (error) {
    return <div className={styles.container}><div className={styles.error}>Error: {error}</div></div>;
  }

  if (!build) {
    return <div className={styles.container}><div className={styles.error}>Build not found</div></div>;
  }

  const ratingPercentage =
    build.likes + build.dislikes === 0
      ? 50
      : Math.round((build.likes / (build.likes + build.dislikes)) * 100);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>{build.name || "Unnamed Build"}</h1>
          <p className={styles.creator}>by {build.creatorName || "Anonymous"}</p>
        </div>
        <Link href="/builder/talents/browse" className={styles.backLink}>
          ← Back to Builds
        </Link>
      </div>

      {/* Build Info Grid */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <h3>Community Rating & Vote</h3>
          <div className={styles.ratingDisplay}>
            <div className={styles.voteSection}>
              <div className={styles.ratingBox}>
                <div className={styles.voteCount}>
                  <span className={styles.like}>👍 {build.likes} Likes</span>
                  <span className={styles.dislike}>👎 {build.dislikes} Dislikes</span>
                </div>
                <div className={styles.ratingBar}>
                  <div
                    className={styles.ratingFill}
                    style={{
                      width: `${ratingPercentage}%`,
                      backgroundColor: ratingPercentage > 50 ? "#4caf50" : "#f44336",
                    }}
                  />
                  <span className={styles.ratingPercent}>{ratingPercentage}%</span>
                </div>
              </div>
              <VoteButtons
                buildId={buildId}
                initialLikes={build.likes}
                initialDislikes={build.dislikes}
                initialUserVote={build.userVote}
              />
            </div>
          </div>
        </div>

        {build.tags && build.tags.length > 0 && (
          <div className={styles.infoCard}>
            <h3>Tags</h3>
            <div className={styles.tags}>
              {build.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.infoCard}>
          <h3>Details</h3>
          <div className={styles.details}>
            <p>
              <strong>Max Feathers:</strong> {build.maxFeathers || 0}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(build.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              <strong>Total Votes:</strong> {build.likes + build.dislikes}
            </p>
          </div>
        </div>
      </div>

      {/* Talent Tree */}
      <div className={builderStyles.talentSection}>
        <h2>Talent Distribution</h2>

        {/* Talent Branch Display with Controls */}
        <div className={builderStyles.branchContainer} ref={treeWrapperRef}>
          {/* Increment Controls - Top Left */}
          <div
            className={builderStyles.incrementControls}
            onPointerDown={stopZoomEvent}
            onDoubleClick={stopZoomEvent}
          >
            {[1, 5, 10].map((value) => (
              <button
                key={value}
                className={`${builderStyles.incrementBtn} ${
                  incrementValue === value ? builderStyles.active : ""
                }`}
                onClick={() => setIncrementValue(value)}
              >
                +{value}
              </button>
            ))}
          </div>
          {/* Feathers Display - Top Right */}
          <div
            className={builderStyles.feathersDisplay}
            onPointerDown={stopZoomEvent}
            onDoubleClick={stopZoomEvent}
          >
            <span className={builderStyles.feathersText}>
              {totalFeathersSpent}/{build.maxFeathers}
            </span>
          </div>

          {/* Tab Buttons - Top Center */}
          <div
            className={builderStyles.tabContainerInside}
            onPointerDown={stopZoomEvent}
            onDoubleClick={stopZoomEvent}
          >
            {TALENT_TAB_ORDER.map((tab) => (
              <button
                key={tab}
                className={`${builderStyles.tabButtonInside} ${
                  selectedTab === tab ? builderStyles.active : ""
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <TransformWrapper
            key={treeScaleKey}
            initialScale={initialTransform.scale}
            initialPositionX={initialTransform.x}
            initialPositionY={initialTransform.y}
            minScale={Math.max(treeScale * 0.6, 0.2)}
            maxScale={2.5}
            centerOnInit={false}
            limitToBounds={false}
            doubleClick={{ disabled: true }}
            panning={{ velocityDisabled: true }}
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
          >
            {({ zoomIn, zoomOut }) => (
              <>
                <div
                  className={builderStyles.actionControls}
                  onPointerDown={stopZoomEvent}
                  onDoubleClick={stopZoomEvent}
                >
                  <button
                    type="button"
                    className={builderStyles.resetBranchBtn}
                    onClick={handleResetBranch}
                    title="Reset current branch"
                  >
                    <span className={builderStyles.buttonText}>Reset</span>
                    <span className={builderStyles.buttonIcon}>↻</span>
                  </button>
                  <button
                    type="button"
                    className={builderStyles.undoBtn}
                    onClick={handleUndo}
                    disabled={!lastAction}
                    title="Undo last action"
                  >
                    <span className={builderStyles.buttonText}>Undo</span>
                    <span className={builderStyles.buttonIcon}>↶</span>
                  </button>
                  <button
                    type="button"
                    className={builderStyles.resetBranchBtn}
                    onClick={() => zoomIn(0.2)}
                    title="Zoom in"
                  >
                    <span className={builderStyles.buttonText}>Zoom +</span>
                    <span className={builderStyles.buttonIcon}>+</span>
                  </button>
                  <button
                    type="button"
                    className={builderStyles.resetBranchBtn}
                    onClick={() => zoomOut(0.2)}
                    title="Zoom out"
                  >
                    <span className={builderStyles.buttonText}>Zoom -</span>
                    <span className={builderStyles.buttonIcon}>−</span>
                  </button>
                </div>

                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                >
              <div className={builderStyles.talentCanvas}>
                <TalentBranch
                  branchName={selectedTab}
                  nodes={getTabNodes(selectedTab)}
                  points={branchPoints[selectedTab]}
                  onNodeInvestment={handleNodeInvestment}
                  readOnly={true}
                  incrementValue={incrementValue}
                  activeSegments={[]}
                />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </div>

      {/* Build Stats Summary */}
      <div className={styles.statsSection}>
        <h2>Build Summary</h2>
        <div className={styles.statsGrid}>
          {TALENT_TAB_ORDER.map((tab) => {
            const points = branchPoints[tab];
            const totalPoints = points.reduce((sum, p) => sum + p, 0);
            const activeNodes = points.filter((p) => p > 0).length;

            return (
              <div key={tab} className={styles.statCard}>
                <h4>{tab}</h4>
                <p>
                  <strong>Total Points:</strong> {totalPoints}
                </p>
                <p>
                  <strong>Active Nodes:</strong> {activeNodes}
                </p>
                <p>
                  <strong>Avg Points/Node:</strong>{" "}
                  {activeNodes > 0 ? (totalPoints / activeNodes).toFixed(1) : 0}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
