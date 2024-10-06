"use client"; // Spécifie que ce composant est côté client

import React, { useLayoutEffect, useRef, useState } from 'react';
import TalentNode from '../TalentNode/TalentNode';
import styles from './TalentBranch.module.css'; // Module CSS de la branche

const TalentBranch = ({ branchName, nodes, points, onUpdatePoints }) => {
  const nodeRefs = useRef([]); // Un tableau de références pour chaque nœud
  const containerRef = useRef(null); // Référence au conteneur du talent tree
  const [nodePositions, setNodePositions] = useState([]); // Stocker les positions des nœuds

  // Liste des connexions entre les nœuds (à compléter avec toutes les connexions demandées)
  const connections = [
    [0, 1],[0, 2], [2, 5], [2, 6], [1, 3], [1, 4],
    [3, 7], [4, 7], [5, 8], [6, 8], [7, 9], [8, 9],
    [10,11],[10, 12], [12, 15], [12, 16], [11, 13], [11, 14],
    [13, 17], [14, 17], [15, 18], [16, 18], [17, 19], [18, 19],
    [20,21],[20, 22], [22, 25], [22, 26], [21, 23], [21, 24],
    [23, 27], [24, 27], [25, 28], [26, 28], [27, 29], [28, 29]
  ];

  // Fonction pour vérifier si un nœud est déblocable avec les nouvelles règles
  const canActivateNode = (nodeIndex) => {
    const parentConnections = connections.filter(([parent, child]) => child === nodeIndex);

    // Pour les nœuds 0 à 8, les parents doivent avoir au moins 10 points
    if (nodeIndex >= 0 && nodeIndex <= 8 || nodeIndex >= 10 && nodeIndex <= 18 || nodeIndex >= 20 && nodeIndex <= 28) {
      return parentConnections.every(([parent]) => points[parent] >= 10);
    }
    // Pour le nœud 9 (dernier), les parents doivent avoir au moins 5 points
    if (nodeIndex === 9 || nodeIndex === 19 || nodeIndex === 29) {
      return parentConnections.every(([parent]) => points[parent] >= 5);
    }

    // Par défaut, on vérifie simplement si les parents ont des points
    return parentConnections.every(([parent]) => points[parent] > 0);
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      console.log("Container Rect:", containerRect);

      const positions = nodeRefs.current.map((ref, index) => {
        if (!ref) return null;

        // Cibler la div interne du nœud contenant les informations
        const innerDiv = ref.querySelector('.TalentNode_talentInfo__Pd0_g');
        if (!innerDiv) return null;

        const rect = innerDiv.getBoundingClientRect();
        console.log(`Node ${index} Rect:`, rect);

        return {
          top: rect.y - containerRect.y, // Ajuster en fonction de la position du container
          left: rect.x - containerRect.x, // Ajuster en fonction de la position du container
          width: rect.width,
          height: rect.height
        };
      });

      setNodePositions(positions.filter(pos => pos !== null));
      console.log("Node positions:", positions);
    }
  }, [nodes, points]);

  const handleNodeClick = (nodeIndex, maxPoints, effectPerPoint, effectType, statAffected) => {
    if (points[nodeIndex] < maxPoints) {
      // Vérifier si le nœud peut être activé
      if (canActivateNode(nodeIndex)) {
        const newPoints = points[nodeIndex] + 1;
        onUpdatePoints(branchName, nodeIndex, newPoints, effectPerPoint, statAffected, effectType); // Mise à jour des points et des stats

        const newEffectValue = effectPerPoint * newPoints;
        const formattedEffectValue = effectType === 'percentage' ? `${newEffectValue}%` : newEffectValue;
        console.log(`Node ${nodeIndex} in ${branchName} has ${newPoints} points affecting ${statAffected} by ${formattedEffectValue}`);
      } else {
        console.log(`Node ${nodeIndex} cannot be activated yet!`);
      }
    }
  };

  return (
    <div className={styles.talentBranch} ref={containerRef}> {/* Référence au conteneur */}
      <h2>{branchName}</h2>

      {/* SVG pour dessiner les lignes */}
      <svg width="1500px" height="1500px" style={{ position: "absolute", zIndex: 0 }}>
        {nodePositions.length > 1 && (
          <>
            {connections.map(([start, end], index) => (
              nodePositions[start] && nodePositions[end] && (
                <line
                  key={index}
                  x1={nodePositions[start].left + nodePositions[start].width / 2}
                  y1={nodePositions[start].top - nodePositions[start].height / 2}
                  x2={nodePositions[end].left + nodePositions[end].width / 2}
                  y2={nodePositions[end].top - nodePositions[end].height / 2}
                  className={styles.line}
                />
              )
            ))}
          </>
        )}
      </svg>

      <div className={styles.nodes}>
        {nodes.map((node, index) => (
          <div ref={el => (nodeRefs.current[index] = el)} key={`${branchName}-${node.name}-${index}`}>
            <TalentNode
              name={node.name}
              maxPoints={node.maxPoints}
              currentPoints={points[index]}
              effectPerPoint={node.effectPerPoint}
              effectType={node.effectType}
              statAffected={node.statAffected}
              onClick={() => handleNodeClick(index, node.maxPoints, node.effectPerPoint, node.effectType, node.statAffected)}
              positionClass={`node${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentBranch;
