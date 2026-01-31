"use client"; // Spécifie que ce composant est côté client

import React, { forwardRef } from "react";
import styles from "./TalentNode.module.css"; // Import du module CSS

const TalentNode = forwardRef(
  (
    {
      name,
      maxPoints,
      currentPoints,
      effectPerPoint,
      effectType,
      statAffected,
      onClick,
      positionClass,
    },
    ref
  ) => {
    const effectValue =
      effectType === "percentage"
        ? `${effectPerPoint * currentPoints}%`
        : effectPerPoint * currentPoints;
    const isActive = currentPoints > 0;

    return (
      <>
        <div
          className={`${styles.talentNodeHeader} ${
            styles[positionClass + "-title"]
          }`}
        >
          <p>{name}</p>
        </div>

        {/* Nœud Talent */}
        <div
          ref={ref}
          data-talent-node
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
  }
);

TalentNode.displayName = "TalentNode";

export default TalentNode;
