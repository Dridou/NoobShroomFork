"use client"; // Spécifie que ce composant est côté client

import React from 'react';
import TalentNode from '../TalentNode/TalentNode';
import styles from './TalentBranch.module.css'; // Module CSS de la branche

const TalentBranch = ({ branchName, nodes, points, onUpdatePoints }) => {
  const handleNodeClick = (nodeIndex, maxPoints, effectPerPoint, effectType, statAffected) => {
    if (points[nodeIndex] < maxPoints) {
      const newPoints = points[nodeIndex] + 1;
      onUpdatePoints(branchName, nodeIndex, newPoints, effectPerPoint, statAffected, effectType); // Mise à jour des points et des stats

      const newEffectValue = effectPerPoint * newPoints;
      const formattedEffectValue = effectType === 'percentage' ? `${newEffectValue}%` : newEffectValue;
      console.log(`Node ${nodeIndex} in ${branchName} has ${newPoints} points affecting ${statAffected} by ${formattedEffectValue}`);
    }
  };

  return (
    <div className={styles.talentBranch}>
      <h2>{branchName}</h2>
      <div className={styles.nodes}>
        {nodes.map((node, index) => (
          <TalentNode
            key={`${branchName}-${node.name}`}
            name={node.name}
            maxPoints={node.maxPoints}
            currentPoints={points[index]}
            effectPerPoint={node.effectPerPoint}
            effectType={node.effectType}
            statAffected={node.statAffected}
            onClick={() => handleNodeClick(index, node.maxPoints, node.effectPerPoint, node.effectType, node.statAffected)}
            positionClass={`node${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TalentBranch;
