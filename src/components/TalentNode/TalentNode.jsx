"use client"; // Spécifie que ce composant est côté client

import React from "react";
import styles from "./TalentNode.module.css"; // Import du module CSS

const TalentNode = ({
  name,
  maxPoints,
  currentPoints,
  effectPerPoint,
  effectType,
  statAffected,
  onClick,
  positionClass,
}) => {
  const effectValue =
    effectType === "percentage"
      ? `${effectPerPoint * currentPoints}%`
      : effectPerPoint * currentPoints;
  const isActive = currentPoints > 0;

  return (
    <>
      {/* Div au-dessus du nœud (par exemple, nom du talent) */}
      <div
        className={`${styles.talentNodeHeader} ${
          styles[positionClass + "-title"]
        }`}
      >
        <p>{name}</p>
      </div>

      {/* Nœud Talent */}
      <div
        className={`${styles.talentNode} ${styles[isActive ? "active" : ""]} ${
          styles[positionClass]
        }`}
        onClick={onClick}
      >
        <div className={styles.talentInfo}>
          <p>
            {currentPoints}/{maxPoints}
          </p>
        </div>
      </div>
    </>
  );
};

export default TalentNode;
