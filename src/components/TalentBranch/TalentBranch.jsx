"use client"; // Spécifie que ce composant est côté client

import React, { useLayoutEffect, useRef, useState } from "react";
import TalentNode from "../TalentNode/TalentNode";
import styles from "./TalentBranch.module.css"; // Module CSS de la branche

const TalentBranch = ({
  branchName,
  nodes,
  points,
  onUpdatePoints,
  onResetBranch,
  playerFeathers,
  setPlayerFeathers,
}) => {
  const nodeRefs = useRef([]); // Un tableau de références pour chaque nœud
  const containerRef = useRef(null); // Référence au conteneur du talent tree
  const [nodePositions, setNodePositions] = useState([]); // Stocker les positions des nœuds

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

  const nodeCosts = {
    // Coût pour les noeuds 0, 1, 2
    0: [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100],
    1: [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100],
    2: [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100],

    // Coût pour les noeuds 3, 4, 5, 6
    3: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],
    4: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],
    5: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],
    6: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],

    // Coût pour les noeuds 7 et 8
    7: [153, 193, 233, 277, 313, 357, 430, 550, 667, 787],
    8: [153, 193, 233, 277, 313, 357, 430, 550, 667, 787],

    // Coût pour le dernier noeud (9)
    9: [1584],

    // Coût pour les noeuds 0, 1, 2
    10: [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100],
    11: [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100],
    12: [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100],

    // Coût pour les noeuds 3, 4, 5, 6
    13: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],
    14: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],
    15: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],
    16: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],

    // Coût pour les noeuds 7 et 8
    17: [153, 193, 233, 277, 313, 357, 430, 550, 667, 787],
    18: [153, 193, 233, 277, 313, 357, 430, 550, 667, 787],

    // Coût pour le dernier noeud (9)
    19: [1584],

    // Coût pour les noeuds 0, 1, 2
    20: [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100],
    21: [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100],
    22: [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100],

    // Coût pour les noeuds 3, 4, 5, 6
    23: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],
    24: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],
    25: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],
    26: [
      18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149,
      171, 189, 216,
    ],

    // Coût pour les noeuds 7 et 8
    27: [153, 193, 233, 277, 313, 357, 430, 550, 667, 787],
    28: [153, 193, 233, 277, 313, 357, 430, 550, 667, 787],

    // Coût pour le dernier noeud (9)
    29: [1584],
  };

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

    console.log(
      "isBranchStartedButNotFinished(0, 8, 9)",
      isBranchStartedButNotFinished(0, 8, 9)
    );
    console.log(
      "isBranchStartedButNotFinished(10, 18, 19)",
      isBranchStartedButNotFinished(10, 18, 19)
    );
    console.log(
      "isBranchStartedButNotFinished(20, 28, 29)",
      isBranchStartedButNotFinished(20, 28, 29)
    );

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
    if (!canActivateNode(nodeIndex)) {
      return;
    }
    if (points[nodeIndex] < maxPoints) {
      const requiredPoints = () => {
        if (
          nodeIndex === 7 ||
          nodeIndex === 8 ||
          nodeIndex === 17 ||
          nodeIndex === 18 ||
          nodeIndex === 28 ||
          nodeIndex === 29
        ) {
          return 5;
        } else if (nodeIndex === 9 || nodeIndex === 19 || nodeIndex === 29) {
          return 1;
        }
        return 10;
      };
      const newPoints =
        Math.min(points[nodeIndex] + requiredPoints(), maxPoints) -
        points[nodeIndex];
      onUpdatePoints(
        branchName,
        nodeIndex,
        newPoints,
        newPoints * effectPerPoint,
        statAffected,
        effectType
      );
      let totalCost = 0;
      for (let i = points[nodeIndex]; i < points[nodeIndex] + newPoints; i++) {
        totalCost += nodeCosts[nodeIndex][i];
      }
      setPlayerFeathers(playerFeathers - totalCost); // Déduire le coût en plumes
    }
  };

  const handleNodeClick = (
    nodeIndex,
    maxPoints,
    effectPerPoint,
    effectType,
    statAffected
  ) => {
    const currentCost = nodeCosts[nodeIndex][points[nodeIndex]]; // Coût du prochain point
    if (playerFeathers >= currentCost && points[nodeIndex] < maxPoints) {
      // Vérifier si le noeud peut être activé
      if (canActivateNode(nodeIndex)) {
        const newPoints = points[nodeIndex] + 1;
        onUpdatePoints(
          branchName,
          nodeIndex,
          1,
          effectPerPoint,
          statAffected,
          effectType
        ); // Mise à jour des points et des stats
        setPlayerFeathers(playerFeathers - currentCost); // Déduire le coût en plumes
      } else {
        console.log(`Node ${nodeIndex} cannot be activated yet!`);
      }
    } else {
      console.log("Not enough feathers to activate this node!");
    }
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
        width="1500px"
        height="1500px"
        style={{ position: "absolute", zIndex: 0 }}
      >
        {nodePositions.length > 1 && (
          <>
            {connections.map(
              ([start, end], index) =>
                nodePositions[start] &&
                nodePositions[end] && (
                  <line
                    key={index}
                    x1={
                      nodePositions[start].left + nodePositions[start].width / 2
                    }
                    y1={
                      nodePositions[start].top - nodePositions[start].height / 2
                    }
                    x2={nodePositions[end].left + nodePositions[end].width / 2}
                    y2={nodePositions[end].top - nodePositions[end].height / 2}
                    className={styles.line}
                  />
                )
            )}
          </>
        )}
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
