"use client"; // Spécifie que ce composant est côté client

import React, { useLayoutEffect, useRef, useState } from "react";
import TalentNode from "../TalentNode/TalentNode";
import styles from "./TalentBranch.module.css"; // Module CSS de la branche
import {
  getNodeCost,
  getNodePointStep,
  isFinalNodeIndex,
} from "@/utils/talentCosts";

const TalentBranch = ({
  branchName,
  nodes,
  points,
  onUpdatePoints,
  onResetBranch,
  playerFeathers,
  setPlayerFeathers,
  setBranchFeathers,
  setBranchPoints,
  finalTalentCount,
  maxFinalTalents,
  readOnly = false,
  incrementValue = 1,
}) => {
  const nodeRefs = useRef([]); // Un tableau de références pour chaque nœud
  const containerRef = useRef(null); // Référence au conteneur du talent tree
  const [nodePositions, setNodePositions] = useState([]); // Stocker les positions des nœuds
  const svgRef = useRef(null); // Référence pour mémoriser le SVG et éviter le redessin

  // Liste des connexions entre les nœuds
  const connections = [
    [0, 1],
    [0, 2],
    [2, 5],
    [2, 6],
    [1, 3],
    [1, 4],
    [3, 7],
    [4, 7],
    [5, 8],
    [6, 8],
    [7, 9],
    [8, 9],
    [10, 11],
    [10, 12],
    [12, 15],
    [12, 16],
    [11, 13],
    [11, 14],
    [13, 17],
    [14, 17],
    [15, 18],
    [16, 18],
    [17, 19],
    [18, 19],
    [20, 21],
    [20, 22],
    [22, 25],
    [22, 26],
    [21, 23],
    [21, 24],
    [23, 27],
    [24, 27],
    [25, 28],
    [26, 28],
    [27, 29],
    [28, 29],
  ];

  const canActivateNode = (nodeIndex) => {
    const parentConnections = connections.filter(
      ([parent, child]) => child === nodeIndex
    );
    const isBranchStartedButNotFinished = (start, end, lastNode) => {
      const branchStarted = points
        .slice(start, end + 1)
        .some((points) => points > 0);
      const branchFinished = points[lastNode] > 0;
      return branchStarted && !branchFinished;
    };

    if (
      isFinalNodeIndex(nodeIndex) &&
      points[nodeIndex] === 0 &&
      typeof maxFinalTalents === "number" &&
      typeof finalTalentCount === "number" &&
      finalTalentCount >= maxFinalTalents
    ) {
      return false;
    }

    // Si une branche est terminée, on doit permettre de revenir ajouter des points dans cette branche
    const isBranchFinished = (lastNode) =>
      points[lastNode] == 1;

    // Si la branche 0-9 est terminée, on peut ajouter des points à cette branche même si une autre est commencée
    if (isBranchFinished(9) && nodeIndex <= 9) {
      return true;
    }

    // Si la branche 10-19 est terminée, on peut ajouter des points à cette branche même si une autre est commencée
    if (isBranchFinished(19) && nodeIndex >= 10 && nodeIndex <= 19) {
      return true;
    }

    // Si la branche 20-29 est terminée, on peut ajouter des points à cette branche même si une autre est commencée
    if (isBranchFinished(29) && nodeIndex >= 20 && nodeIndex <= 29) {
      return true;
    }

    if (
      isBranchStartedButNotFinished(0, 8, 9) &&
      nodeIndex >= 10 &&
      nodeIndex <= 29
    ) {
      return false;
    }
    if (
      isBranchStartedButNotFinished(10, 18, 19) &&
      (nodeIndex <= 9 || nodeIndex >= 20)
    ) {
      return false;
    }
    if (isBranchStartedButNotFinished(20, 28, 29) && nodeIndex <= 19) {
      return false;
    }

    if (
      (nodeIndex >= 0 && nodeIndex <= 8) ||
      (nodeIndex >= 10 && nodeIndex <= 18) ||
      (nodeIndex >= 20 && nodeIndex <= 28)
    ) {
      return parentConnections.every(([parent]) => points[parent] >= 10);
    }

    if (nodeIndex === 9 || nodeIndex === 19 || nodeIndex === 29) {
      return parentConnections.every(([parent]) => points[parent] >= 5);
    }

    return parentConnections.every(([parent]) => points[parent] > 0);
  };
  const handleAddMaxPoints = (
    nodeIndex,
    maxPoints,
    effectPerPoint,
    effectType,
    statAffected
  ) => {
    if (readOnly) return;
    
    if (!canActivateNode(nodeIndex)) {
      return;
    }

    if (points[nodeIndex] < maxPoints) {
      const step = getNodePointStep(nodeIndex);
      const newPoints =
        Math.min(points[nodeIndex] + step, maxPoints) - points[nodeIndex];

      let totalCost = 0;
      for (let i = points[nodeIndex]; i < points[nodeIndex] + newPoints; i++) {
        totalCost += getNodeCost(nodeIndex, i);
      }

      if (playerFeathers < totalCost) {
        return;
      }

      onUpdatePoints(
        branchName,
        nodeIndex,
        newPoints,
        newPoints * effectPerPoint,
        statAffected,
        effectType
      );
      setPlayerFeathers(playerFeathers - totalCost);
      setBranchFeathers((prevBranchFeathers) => ({
        ...prevBranchFeathers,
        [branchName]: prevBranchFeathers[branchName] + totalCost,
      }));
    }
  };

  const handleNodeClick = (
    nodeIndex,
    maxPoints,
    effectPerPoint,
    effectType,
    statAffected
  ) => {
    if (readOnly) return;
    
    if (!canActivateNode(nodeIndex)) {
      return;
    }

    // Calculate total cost for adding incrementValue points
    let totalCost = 0;
    const pointsToAdd = Math.min(
      incrementValue,
      maxPoints - points[nodeIndex]
    );
    
    for (let i = points[nodeIndex]; i < points[nodeIndex] + pointsToAdd; i++) {
      totalCost += getNodeCost(nodeIndex, i);
    }

    if (playerFeathers < totalCost || points[nodeIndex] >= maxPoints) {
      return;
    }

    onUpdatePoints(
      branchName,
      nodeIndex,
      pointsToAdd,
      pointsToAdd * effectPerPoint,
      statAffected,
      effectType
    );
    setPlayerFeathers(playerFeathers - totalCost);
    setBranchFeathers((prevBranchFeathers) => ({
      ...prevBranchFeathers,
      [branchName]: prevBranchFeathers[branchName] + totalCost,
    }));
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const positions = nodeRefs.current.map((ref, index) => {
        if (!ref) return null;
        const innerDiv = ref.querySelector(".TalentNode_talentInfo__Pd0_g");
        if (!innerDiv) return null;
        const rect = innerDiv.getBoundingClientRect();
        return {
          top: rect.y - containerRect.y,
          left: rect.x - containerRect.x,
          width: rect.width,
          height: rect.height,
        };
      });
      setNodePositions(positions.filter((pos) => pos !== null));
    }
  }, [nodes, points]);

  return (
    <div className={styles.talentBranch} ref={containerRef}>
      <svg
        // ref={svgRef}
        width="100%"
        height="100%"
        style={{ position: "absolute", zIndex: 0 }}
      >
        {nodePositions.length > 1 &&
          connections.map(([start, end], index) => (
            <line
              key={index}
              x1={nodePositions[start].left + nodePositions[start].width / 2}
              y1={nodePositions[start].top - nodePositions[start].height / 2}
              x2={nodePositions[end].left + nodePositions[end].width / 2}
              y2={nodePositions[end].top - nodePositions[end].height / 2}
              className={styles.line}
            />
          ))}
      </svg>

      <div className={styles.nodes}>
        {nodes.map((node, index) => (
          <div
            ref={(el) => (nodeRefs.current[index] = el)}
            key={`${branchName}-${node.name}-${index}`}
          >
            <TalentNode
              name={node.name}
              maxPoints={node.maxPoints}
              currentPoints={points[index]}
              effectPerPoint={node.effectPerPoint}
              effectType={node.effectType}
              statAffected={node.statAffected}
              onClick={() =>
                handleNodeClick(
                  index,
                  node.maxPoints,
                  node.effectPerPoint,
                  node.effectType,
                  node.statAffected
                )
              }
              positionClass={`node${index + 1}`}
              onAddMaxPoints={() =>
                handleAddMaxPoints(
                  index,
                  node.maxPoints,
                  node.effectPerPoint,
                  node.effectType,
                  node.statAffected
                )
              } // Bouton pour ajouter les points
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentBranch;
