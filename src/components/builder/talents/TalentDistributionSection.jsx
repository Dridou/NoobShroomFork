"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import TalentBranch from "@/components/talent/TalentBranch/TalentBranch";
import { TALENT_TABS, TALENT_TAB_ORDER } from "@/data/talents";
import styles from "./TalentBuilder.module.css";

const TREE_WIDTH = 1350;
const TREE_HEIGHT = 1000;
const BRANCH_VIEW_WIDTH = 470;
const BRANCH_VIEW_HEIGHT = 545;

const TalentDistributionSection = ({
  selectedTab,
  setSelectedTab,
  incrementValue,
  setIncrementValue,
  getTalentBranchProps,
  onResetBranch,
  onUndo,
  lastAction,
  feathersSpent,
  feathersTotal,
}) => {
  const treeWrapperRef = useRef(null);
  const [treeScale, setTreeScale] = useState(1);
  const [initialTransform, setInitialTransform] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

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

  const branchProps = getTalentBranchProps?.(selectedTab) || {};
  const resolvedNodes = branchProps.nodes || TALENT_TABS[selectedTab].nodes;
  const resolvedPoints = branchProps.points || [];
  const resolvedBranchName = branchProps.branchName || selectedTab;

  const handleReset = onResetBranch || (() => {});
  const handleUndo = onUndo || (() => {});

  return (
    <div className={styles.talentSection}>
      <h2>Talent Distribution</h2>

      <div className={styles.branchContainer} ref={treeWrapperRef}>
        <div
          className={styles.incrementControls}
          onPointerDown={stopZoomEvent}
          onDoubleClick={stopZoomEvent}
        >
          {[1, 5, 10].map((value) => (
            <button
              key={value}
              className={`${styles.incrementBtn} ${
                incrementValue === value ? styles.active : ""
              }`}
              onClick={() => setIncrementValue(value)}
            >
              +{value}
            </button>
          ))}
        </div>

        <div
          className={styles.feathersDisplay}
          onPointerDown={stopZoomEvent}
          onDoubleClick={stopZoomEvent}
        >
          <span className={styles.feathersText}>
            {feathersSpent}/{feathersTotal}
          </span>
        </div>

        <div
          className={styles.tabContainerInside}
          onPointerDown={stopZoomEvent}
          onDoubleClick={stopZoomEvent}
        >
          {TALENT_TAB_ORDER.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButtonInside} ${
                selectedTab === tab ? styles.active : ""
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
                className={styles.actionControls}
                onPointerDown={stopZoomEvent}
                onDoubleClick={stopZoomEvent}
              >
                <button
                  type="button"
                  className={styles.resetBranchBtn}
                  onClick={handleReset}
                  title="Reset current branch"
                >
                  <span className={styles.buttonText}>Reset</span>
                  <span className={styles.buttonIcon}>↻</span>
                </button>
                <button
                  type="button"
                  className={styles.undoBtn}
                  onClick={handleUndo}
                  disabled={!lastAction}
                  title="Undo last action"
                >
                  <span className={styles.buttonText}>Undo</span>
                  <span className={styles.buttonIcon}>↶</span>
                </button>
                <button
                  type="button"
                  className={styles.resetBranchBtn}
                  onClick={() => zoomIn(0.2)}
                  title="Zoom in"
                >
                  <span className={styles.buttonText}>Zoom +</span>
                  <span className={styles.buttonIcon}>+</span>
                </button>
                <button
                  type="button"
                  className={styles.resetBranchBtn}
                  onClick={() => zoomOut(0.2)}
                  title="Zoom out"
                >
                  <span className={styles.buttonText}>Zoom -</span>
                  <span className={styles.buttonIcon}>−</span>
                </button>
              </div>

              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <div className={styles.talentCanvas}>
                  <TalentBranch
                    {...branchProps}
                    branchName={resolvedBranchName}
                    nodes={resolvedNodes}
                    points={resolvedPoints}
                    incrementValue={incrementValue}
                    activeSegments={branchProps.activeSegments || []}
                  />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default TalentDistributionSection;
