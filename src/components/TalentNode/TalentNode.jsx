"use client"; // Spécifie que ce composant est côté client

import React from 'react';
import styles from './TalentNode.module.css'; // Import du module CSS

const TalentNode = ({ name, maxPoints, currentPoints, effectPerPoint, effectType, statAffected, onClick, positionClass }) => {
  const effectValue = effectType === 'percentage' ? `${effectPerPoint * currentPoints}%` : effectPerPoint * currentPoints;

  return (
    <div className={`${styles.talentNode} ${styles[positionClass]}`} onClick={onClick}>
      <div className={styles.talentInfo}>
        <p>{name}</p>
        <p>{currentPoints}/{maxPoints}</p>
        {/* <p>Effect: {effectValue} {effectType === 'percentage' ? 'increase' : ''} on {statAffected}</p> */}
      </div>
    </div>
  );
};

export default TalentNode;
