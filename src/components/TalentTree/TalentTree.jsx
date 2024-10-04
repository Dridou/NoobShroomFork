"use client"; // Indique que ce composant est côté client

import React, { useState } from "react";
import TalentBranch from "../TalentBranch/TalentBranch";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./TalentTree.module.css"; // Module CSS

const TalentTree = () => {
  // Définir des nœuds pour chaque branche

  const furyNodes = [
    {
      name: "HP",
      maxPoints: 20,
      effectPerPoint: 0.1,
      effectType: "fixed",
      statAffected: "Attack Speed",
    },
    {
      name: "DEF",
      maxPoints: 15,
      effectPerPoint: 5,
      effectType: "percentage",
      statAffected: "Critical Chance",
    },
    {
      name: "ATk",
      maxPoints: 10,
      effectPerPoint: 50,
      effectType: "fixed",
      statAffected: "HP",
    },
  ];

  const archeryNodes = [
    {
      name: "ATK SPD",
      maxPoints: 20,
      effectPerPoint: 0.1,
      effectType: "fixed",
      statAffected: "Attack Speed",
    },
    {
      name: "Critical Hit",
      maxPoints: 15,
      effectPerPoint: 5,
      effectType: "percentage",
      statAffected: "Critical Chance",
    },
    {
      name: "HP Boost",
      maxPoints: 10,
      effectPerPoint: 50,
      effectType: "fixed",
      statAffected: "HP",
    },
  ];

  const sorceryNodes = [
    {
      name: "Magic Power",
      maxPoints: 20,
      effectPerPoint: 1,
      effectType: "fixed",
      statAffected: "Magic Power",
    },
    {
      name: "Mana Regen",
      maxPoints: 15,
      effectPerPoint: 2,
      effectType: "fixed",
      statAffected: "Mana Regen",
    },
    {
      name: "Fire Resistance",
      maxPoints: 10,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Fire Resistance",
    },
  ];

  const beastNodes = [
    {
      name: "ATK SPD",
      maxPoints: 20,
      effectPerPoint: 0.1,
      effectType: "fixed",
      statAffected: "Attack Speed",
    },
    {
      name: "Critical Hit",
      maxPoints: 15,
      effectPerPoint: 5,
      effectType: "percentage",
      statAffected: "Critical Chance",
    },
    {
      name: "HP Boost",
      maxPoints: 10,
      effectPerPoint: 50,
      effectType: "fixed",
      statAffected: "HP",
    },
  ];

  // Gestion des points pour chaque branche
  const [branchPoints, setBranchPoints] = useState({
    Archery: archeryNodes.map(() => 0), // Initialiser les points de chaque nœud pour Archery
    Sorcery: sorceryNodes.map(() => 0), // Initialiser les points de chaque nœud pour Sorcery
  });

  // Gestion des statistiques globales
  const [globalStats, setGlobalStats] = useState({
    "Attack Speed": 0,
    "Critical Chance": 0,
    HP: 0,
    "Magic Power": 0,
    "Mana Regen": 0,
    "Fire Resistance": 0,
  });

  // Branche actuellement sélectionnée
  const [selectedBranch, setSelectedBranch] = useState("Archery");

  // Fonction pour mettre à jour les points dans une branche et les statistiques globales
  const updatePoints = (
    branchName,
    nodeIndex,
    newPoints,
    effectPerPoint,
    statAffected,
    effectType
  ) => {
    setBranchPoints((prevPoints) => ({
      ...prevPoints,
      [branchName]: prevPoints[branchName].map((points, index) =>
        index === nodeIndex ? newPoints : points
      ),
    }));

    // Mise à jour des statistiques globales
    setGlobalStats((prevStats) => ({
      ...prevStats,
      [statAffected]:
        prevStats[statAffected] +
        (effectType === "percentage"
          ? effectPerPoint * newPoints
          : effectPerPoint),
    }));
  };

  const renderBranch = () => {
    switch (selectedBranch) {
      case "Archery":
        return (
          <TalentBranch
            key="Archery"
            branchName="Archery"
            nodes={archeryNodes}
            points={branchPoints.Archery}
            onUpdatePoints={updatePoints}
          />
        );
      case "Sorcery":
        return (
          <TalentBranch
            key="Sorcery"
            branchName="Sorcery"
            nodes={sorceryNodes}
            points={branchPoints.Sorcery}
            onUpdatePoints={updatePoints}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Boutons de navigation entre les branches */}
      <div className={styles.buttonContainer}>
        <button onClick={() => setSelectedBranch('Archery')}>Archery</button>
        <button onClick={() => setSelectedBranch('Sorcery')}>Sorcery</button>
        <button onClick={() => setSelectedBranch('Tame Beasts')}>Tame Beasts</button>
        <button onClick={() => setSelectedBranch('Fury')}>Fury</button>
      </div>

      {/* Affichage de la branche sélectionnée */}
      <TransformWrapper defaultScale={1} wheel={{ step: 0.1 }} pinch={{ step: 5 }} doubleClick={{ disabled: true }}>
        <TransformComponent>
          <div className={styles.talentTreeContainer}>
            {renderBranch()}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default TalentTree;
