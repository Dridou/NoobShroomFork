"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TALENT_TABS, TALENT_TAB_ORDER } from "@/data/talents";
import TalentDistributionSection from "@/components/builder/talents/TalentDistributionSection";
import { getNodeCost } from "@/utils/talentCosts";
import styles from "./TalentBuilder.module.css";

const FINAL_NODE_INDEXES = [9, 19, 29];
const MAX_FINAL_TALENTS = 4;
const BRANCH_SIZE = 10;
const FALLBACK_SCHEMA_VERSION = 1;

const createEmptyPoints = () =>
  TALENT_TAB_ORDER.reduce((acc, tab) => {
    acc[tab] = TALENT_TABS[tab].nodes.map(() => 0);
    return acc;
  }, {});

const createEmptyFeathers = () =>
  TALENT_TAB_ORDER.reduce((acc, tab) => {
    acc[tab] = 0;
    return acc;
  }, {});

const sumNodeCosts = (points) => {
  let total = 0;
  points.forEach((value, nodeIndex) => {
    for (let i = 0; i < value; i += 1) {
      total += getNodeCost(nodeIndex, i);
    }
  });
  return total;
};

const buildConfigFromPoints = (pointsByTab) => {
  const buildTabConfig = (points) => {
    const branches = [0, 1, 2].map((branchIndex) => {
      const start = branchIndex * BRANCH_SIZE;
      const slice = points.slice(start, start + BRANCH_SIZE);
      const nodes = slice.reduce((acc, value, index) => {
        if (value > 0) {
          acc[index.toString()] = value;
        }
        return acc;
      }, {});
      return {
        nodes,
        finalTalentActive: slice[BRANCH_SIZE - 1] > 0,
      };
    });

    return {
      branch1: branches[0],
      branch2: branches[1],
      branch3: branches[2],
    };
  };

  return {
    fury: buildTabConfig(pointsByTab.Fury),
    archery: buildTabConfig(pointsByTab.Archery),
    sorcery: buildTabConfig(pointsByTab.Sorcery),
    tameBeasts: buildTabConfig(pointsByTab.Beast),
  };
};

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

const buildPointsFromConfig = (config) => {
  const buildTabPoints = (tabConfig) => {
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

const parseLegacyConfig = (config) => {
  if (!config || typeof config !== "object") {
    return null;
  }

  if (config.branchPoints) {
    return {
      points: config.branchPoints,
      maxFeathers: Number(config.maxFeathers) || 0,
    };
  }

  if (
    config.fury ||
    config.archery ||
    config.sorcery ||
    config.tameBeasts
  ) {
    return {
      points: buildPointsFromConfig(config),
      maxFeathers: Number(config.maxFeathers) || 0,
    };
  }

  return null;
};

const TalentBuilder = ({ buildId }) => {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState("Fury");
  const [incrementValue, setIncrementValue] = useState(1);
  const [activeBuildId, setActiveBuildId] = useState(buildId || "");
  const [branchPoints, setBranchPoints] = useState(() => createEmptyPoints());
  const [branchFeathers, setBranchFeathers] = useState(() => createEmptyFeathers());
  const [maxFeathers, setMaxFeathers] = useState(20000);
  const [playerFeathers, setPlayerFeathers] = useState(20000);
  const [buildName, setBuildName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [tags, setTags] = useState([]);
  const [shareUrl, setShareUrl] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [buildMeta, setBuildMeta] = useState(null);
  const [voteCounts, setVoteCounts] = useState({ likes: 0, dislikes: 0 });
  const [voteStatus, setVoteStatus] = useState("");
  const [lastSavedFingerprint, setLastSavedFingerprint] = useState("");
  const [lastAction, setLastAction] = useState(null);

  const saveFingerprint = useMemo(() => {
    const config = buildConfigFromPoints(branchPoints);
    return JSON.stringify({
      config,
      maxFeathers,
      schemaVersion: FALLBACK_SCHEMA_VERSION,
      name: buildName || "",
      creatorName: creatorName || "",
      tags,
    });
  }, [branchPoints, maxFeathers, buildName, creatorName, tags]);

  const isUnchanged = lastSavedFingerprint && saveFingerprint === lastSavedFingerprint;

  const isSaveDisabled = loading || isUnchanged;

  const totalSpent = useMemo(() => {
    return Object.values(branchFeathers).reduce((sum, value) => sum + value, 0);
  }, [branchFeathers]);

  const finalTalentCount = useMemo(() => {
    return TALENT_TAB_ORDER.reduce((count, tab) => {
      const points = branchPoints[tab];
      return (
        count +
        FINAL_NODE_INDEXES.filter((index) => points[index] > 0).length
      );
    }, 0);
  }, [branchPoints]);

  // Track node investment for undo functionality
  const handleNodeInvestment = (tabName, nodeIndex, newPoints, costSpent) => {
    setLastAction({
      type: "invest",
      tab: tabName,
      nodeIndex,
      pointsAdded: newPoints,
      costSpent,
      previousPoints: branchPoints[tabName][nodeIndex],
      previousPlayerFeathers: playerFeathers,
      previousBranchFeathers: branchFeathers[tabName],
    });
  };

  const updatePoints = (
    tabName,
    nodeIndex,
    newPoints,
    effectPerPoint,
    statAffected,
    effectType
  ) => {
    setBranchPoints((prevPoints) => ({
      ...prevPoints,
      [tabName]: prevPoints[tabName].map((value, index) =>
        index === nodeIndex ? value + newPoints : value
      ),
    }));
  };

  const resetTab = (tabName) => {
    setBranchPoints((prevPoints) => ({
      ...prevPoints,
      [tabName]: prevPoints[tabName].map(() => 0),
    }));

    setPlayerFeathers((prevFeathers) =>
      prevFeathers + (branchFeathers[tabName] || 0)
    );

    setBranchFeathers((prevBranchFeathers) => ({
      ...prevBranchFeathers,
      [tabName]: 0,
    }));
  };

  const resetAll = () => {
    setBranchPoints(createEmptyPoints());
    setBranchFeathers(createEmptyFeathers());
    setPlayerFeathers(maxFeathers);
    setShareUrl("");
    setFallbackUrl("");
  };

  const handleMaxFeathersChange = (value) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }

    const totalSpent = TALENT_TAB_ORDER.reduce(
      (sum, tab) => sum + sumNodeCosts(branchPoints[tab]),
      0
    );

    setMaxFeathers(parsed);
    setPlayerFeathers(Math.max(parsed - totalSpent, 0));
  };

  const applyLoadedConfig = useCallback((points, maxFeathersValue, meta) => {
    const totals = TALENT_TAB_ORDER.reduce((acc, tab) => {
      acc[tab] = sumNodeCosts(points[tab]);
      return acc;
    }, {});

    const spent = Object.values(totals).reduce(
      (sum, value) => sum + value,
      0
    );

    const resolvedMax =
      Number.isFinite(maxFeathersValue) && maxFeathersValue > 0
        ? maxFeathersValue
        : maxFeathers;

    setBranchPoints(points);
    setBranchFeathers(totals);
    setMaxFeathers(resolvedMax);
    setPlayerFeathers(Math.max(resolvedMax - spent, 0));

    if (meta) {
      setBuildName(meta.name || "");
      setCreatorName(meta.creatorName || "");
      setTags(meta.tags || []);
      setBuildMeta(meta);
      setVoteCounts({
        likes: meta.likes || 0,
        dislikes: meta.dislikes || 0,
      });
    }
  }, [maxFeathers]);

  useEffect(() => {
    const configParam = searchParams?.get("config");
    if (configParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(configParam));
        const parsed = parseLegacyConfig(decoded);
        if (parsed) {
          applyLoadedConfig(parsed.points, parsed.maxFeathers || 0);
        }
      } catch (error) {
        console.error("Failed to parse config from URL", error);
      }
      return;
    }

    if (!buildId) {
      return;
    }

    const loadBuild = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/builder/talents/${buildId}`);
        const data = await response.json();
        if (response.ok) {
          const points = buildPointsFromConfig(data.config);
          applyLoadedConfig(points, data.maxFeathers, data);
          const loadedFingerprint = JSON.stringify({
            config: data.config,
            maxFeathers: data.maxFeathers,
            schemaVersion: data.schemaVersion || FALLBACK_SCHEMA_VERSION,
            name: data.name || "",
            creatorName: data.creatorName || "",
            tags: data.tags || [],
          });
          setLastSavedFingerprint(loadedFingerprint);
        } else {
          console.error("Failed to load build", data.error || data.message);
        }
      } catch (error) {
        console.error("Failed to load build", error);
      } finally {
        setLoading(false);
      }
    };

    loadBuild();
  }, [applyLoadedConfig, buildId, searchParams]);

  const handleSaveShare = async () => {
    if (isUnchanged) {
      return;
    }

    setLoading(true);
    setVoteStatus("");
    try {
      const payload = {
        config: buildConfigFromPoints(branchPoints),
        maxFeathers,
        schemaVersion: FALLBACK_SCHEMA_VERSION,
        name: buildName || undefined,
        creatorName: creatorName || undefined,
        tags,
      };

      const response = await fetch("/api/builder/talents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to save build", data.error || data.message);
        return;
      }

      const linkPath = data.url || `/builder/talents/${data.id}`;
      const fullUrl = linkPath.startsWith("http")
        ? linkPath
        : `${window.location.origin}${linkPath}`;
      setShareUrl(fullUrl);
      setBuildMeta(data);
      setActiveBuildId(data.id || "");
      setVoteCounts({ likes: data.likes || 0, dislikes: data.dislikes || 0 });
      setLastSavedFingerprint(saveFingerprint);
      if (data.id) {
        window.history.replaceState(null, "", `/builder/talents/${data.id}`);
      }

      const fallbackConfig = {
        config: payload.config,
        maxFeathers,
        schemaVersion: FALLBACK_SCHEMA_VERSION,
      };
      const encoded = encodeURIComponent(JSON.stringify(fallbackConfig));
      setFallbackUrl(
        `${window.location.origin}/builder/talents?config=${encoded}`
      );

      await navigator.clipboard.writeText(fullUrl);
    } catch (error) {
      console.error("Failed to save build", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (vote) => {
    if (!activeBuildId) {
      setVoteStatus("Save the build to enable votes.");
      return;
    }

    try {
      const response = await fetch(`/api/builder/talents/${activeBuildId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote }),
      });
      const data = await response.json();
      if (response.ok) {
        setVoteCounts({ likes: data.likes, dislikes: data.dislikes });
        setVoteStatus(data.message || "Vote recorded.");
      } else {
        setVoteStatus(data.error || "Vote failed.");
      }
    } catch (error) {
      setVoteStatus("Vote failed.");
    }
  };

  const toggleTag = (tag) => {
    setTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((item) => item !== tag)
        : [...prevTags, tag]
    );
  };

  const handleResetBranch = () => {
    setLastAction({
      type: "reset",
      tab: selectedTab,
      previousPoints: branchPoints[selectedTab],
      previousFeathers: branchFeathers[selectedTab],
    });
    resetTab(selectedTab);
  };

  const handleUndo = () => {
    if (!lastAction) return;

    if (lastAction.type === "reset") {
      // Undo reset branch
      setBranchPoints((prevPoints) => ({
        ...prevPoints,
        [lastAction.tab]: lastAction.previousPoints,
      }));
      setPlayerFeathers((prevFeathers) =>
        prevFeathers - lastAction.previousFeathers
      );
      setBranchFeathers((prevBranchFeathers) => ({
        ...prevBranchFeathers,
        [lastAction.tab]: lastAction.previousFeathers,
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
      setPlayerFeathers(lastAction.previousPlayerFeathers);
      setBranchFeathers((prevBranchFeathers) => ({
        ...prevBranchFeathers,
        [lastAction.tab]: lastAction.previousBranchFeathers,
      }));
      setLastAction(null);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Create Talent Build</h1>
          <p className={styles.subtitle}>
            Design your talent tree, share it, and let others fork it.
          </p>
          {loading && <span className={styles.loading}>Loading build...</span>}
        </div>
      </div>

      {/* Info Grid with Settings & Stats */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <h3>Build Settings</h3>
          <div className={styles.field}>
            <label htmlFor="max-feathers">Max Feathers</label>
            <input
              id="max-feathers"
              className={styles.featherInput}
              type="number"
              min="0"
              max="100000"
              step="100"
              inputMode="numeric"
              value={maxFeathers}
              onChange={(event) => handleMaxFeathersChange(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="build-name">Build Name (optional)</label>
            <input
              id="build-name"
              type="text"
              value={buildName}
              onChange={(event) => setBuildName(event.target.value)}
              placeholder="Ex: Fury PvE starter"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="creator-name">Your Nickname (optional)</label>
            <input
              id="creator-name"
              type="text"
              value={creatorName}
              onChange={(event) => setCreatorName(event.target.value)}
              placeholder="Ex: SaintM"
            />
          </div>
          <div className={styles.tags}>
            {["PvE", "PvP", "F2P", "Whale"].map((tag) => (
              <button
                key={tag}
                type="button"
                className={`${styles.tag} ${tags.includes(tag) ? styles.tagActive : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={handleSaveShare}
              disabled={isSaveDisabled}
              title={isUnchanged ? "No changes to save." : undefined}
            >
              Save & Share
            </button>
            <button type="button" onClick={() => resetTab(selectedTab)}>
              Reset Tab
            </button>
            <button type="button" onClick={resetAll}>
              Reset All
            </button>
          </div>
          {shareUrl && (
            <div className={styles.shareBox}>
              <p>Share link copied to clipboard.</p>
              <a href={shareUrl}>{shareUrl}</a>
              {fallbackUrl && (
                <div className={styles.fallback}>
                  Fallback: <a href={fallbackUrl}>{fallbackUrl}</a>
                </div>
              )}
            </div>
          )}
          {activeBuildId && (
            <p className={styles.forkNote}>
              Editing this build will create a new shared link.
            </p>
          )}
        </div>

        <div className={styles.infoCard}>
          <h3>Progress</h3>
          <div className={styles.stats}>
            <p>
              <strong>Final Talents:</strong> {finalTalentCount}/{MAX_FINAL_TALENTS}
            </p>
            <p>
              <strong>Feathers Used:</strong> {totalSpent}
            </p>
            <p>
              <strong>Remaining:</strong> {playerFeathers}
            </p>
          </div>
        </div>

        {buildMeta && activeBuildId && (
          <div className={styles.infoCard}>
            <h3>Community Feedback</h3>
            <div className={styles.voteRow}>
              <button type="button" onClick={() => handleVote(1)}>
                Like ({voteCounts.likes})
              </button>
              <button type="button" onClick={() => handleVote(-1)}>
                Dislike ({voteCounts.dislikes})
              </button>
            </div>
            {voteStatus && <span className={styles.voteStatus}>{voteStatus}</span>}
          </div>
        )}
      </div>

      {/* Talent Tree Section */}
      <TalentDistributionSection
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        incrementValue={incrementValue}
        setIncrementValue={setIncrementValue}
        getTalentBranchProps={(tab) => ({
          branchName: tab,
          nodes: TALENT_TABS[tab].nodes,
          points: branchPoints[tab],
          onUpdatePoints: updatePoints,
          onNodeInvestment: handleNodeInvestment,
          onResetBranch: resetTab,
          playerFeathers,
          setPlayerFeathers,
          setBranchFeathers,
          setBranchPoints,
          finalTalentCount,
          maxFinalTalents: MAX_FINAL_TALENTS,
          activeSegments: [],
        })}
        onResetBranch={handleResetBranch}
        onUndo={handleUndo}
        lastAction={lastAction}
        feathersSpent={totalSpent}
        feathersTotal={maxFeathers}
      />

    </div>
  );
};

export default TalentBuilder;
