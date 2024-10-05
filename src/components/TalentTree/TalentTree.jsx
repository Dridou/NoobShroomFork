"use client"; // Indique que ce composant est côté client

import React, { useState } from "react";
import TalentBranch from "../TalentBranch/TalentBranch";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./TalentTree.module.css"; // Module CSS

const TalentTree = () => {
  // Définir des nœuds pour chaque branche

  const furyNodes = [
	// Nœuds 0 à 6 avec 20 maxPoints
	{ name: "HP", maxPoints: 20, effectPerPoint: 600, effectType: "percentage", statAffected: "HP" },
	{ name: "DEF", maxPoints: 20, effectPerPoint: 1200, effectType: "percentage", statAffected: "DEF" },
	{ name: "ATK", maxPoints: 20, effectPerPoint: 400, effectType: "percentage", statAffected: "ATK" },
	{ name: "Counter Dmg", maxPoints: 20, effectPerPoint: 25, effectType: "percentage", statAffected: "Counter Dmg" },
	{ name: "Healing Amount / Rate", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Healing Amount / Rate" },
	{ name: "Crit Res", maxPoints: 20, effectPerPoint: 10, effectType: "percentage", statAffected: "Crit Res" },
	{ name: "Regeneration", maxPoints: 20, effectPerPoint: 0.01, effectType: "percentage", statAffected: "Regeneration %" },

	// Nœuds 7 et 8 avec 10 maxPoints
	{ name: "Ignore Evasion", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Evasion %" },
	{ name: "Ignore Combo", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Combo %" },

	// Nœud 9 avec 1 maxPoint (effet spécial)
	{ name: "Ascension", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" },

	// Nœuds 10 à 16 avec 20 maxPoints
	{ name: "DEF", maxPoints: 20, effectPerPoint: 1200, effectType: "percentage", statAffected: "DEF" },
	{ name: "ATK", maxPoints: 20, effectPerPoint: 400, effectType: "percentage", statAffected: "ATK" },
	{ name: "HP", maxPoints: 20, effectPerPoint: 600, effectType: "percentage", statAffected: "HP" },
	{ name: "Counter Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Counter Res" },
	{ name: "Pal Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Pal Res" },
	{ name: "Skill Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Skill Res" },
	{ name: "Combo Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Combo Res" },

	// Nœuds 17 et 18 avec 10 maxPoints
	{ name: "Evasion", maxPoints: 10, effectPerPoint: 2, effectType: "percentage", statAffected: "Evasion %" },
	{ name: "Basic Atk Res", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Basic Atk Res" },

	// Nœud 19 avec 1 maxPoint (effet spécial)
	{ name: "Rampage", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" },

	// Nœuds 20 à 26 avec 20 maxPoints
	{ name: "ATK", maxPoints: 20, effectPerPoint: 400, effectType: "percentage", statAffected: "ATK" },
	{ name: "DEF", maxPoints: 20, effectPerPoint: 1200, effectType: "percentage", statAffected: "DEF" },
	{ name: "HP", maxPoints: 20, effectPerPoint: 600, effectType: "percentage", statAffected: "HP" },

	{ name: "Counter Regeneration", maxPoints: 20, effectPerPoint: 0.05, effectType: "percentage", statAffected: "Counter Regeneration %" },
	{ name: "Basic Atk Dmg", maxPoints: 20, effectPerPoint: 25, effectType: "percentage", statAffected: "Basic Atk Dmg %" },
	{ name: "Counter Dmg", maxPoints: 20, effectPerPoint: 25, effectType: "percentage", statAffected: "Counter Dmg %" },
	{ name: "Crit Dmg", maxPoints: 20, effectPerPoint: 15, effectType: "percentage", statAffected: "Crit Dmg %" },


	// Nœuds 27 et 28 avec 10 maxPoints
	{ name: "Ignore Combo", maxPoints: 10, effectPerPoint: 2, effectType: "percentage", statAffected: "Ignore Combo %" },
	{ name: "Ignore Evasion", maxPoints: 10, effectPerPoint: 2, effectType: "percentage", statAffected: "Ignore Evasion %" },


	// Nœud 29 avec 1 maxPoint (effet spécial)
	{ name: "Final Blow", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" }
  ];


  const archeryNodes = [
	// Nœuds 0 à 6 avec 20 maxPoints
	{ name: "HP", maxPoints: 20, effectPerPoint: 100, effectType: "fixed", statAffected: "HP" },
	{ name: "Atk", maxPoints: 20, effectPerPoint: 10, effectType: "fixed", statAffected: "ATK" },
	{ name: "Def", maxPoints: 20, effectPerPoint: 5, effectType: "fixed", statAffected: "DEF" },
	{ name: "Combo Dmg", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Combo Dmg %" },
	{ name: "Crit Dmg", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Crit Dmg %" },
	{ name: "Evasion", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Evasion %" },
	{ name: "Healing amount / rate", maxPoints: 20, effectPerPoint: 0.2, effectType: "percentage", statAffected: "Healing Amount / Rate" },

	// Nœuds 7 et 8 avec 10 maxPoints
	{ name: "Ignore Evasion", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Evasion %" },
	{ name: "Ignore Stun", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Stun %" },

	// Nœud 9 avec 1 maxPoint (effet spécial)
	{ name: "Eager Momentum", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" },

	// Nœuds 10 à 16 avec 20 maxPoints
	{ name: "Def", maxPoints: 20, effectPerPoint: 5, effectType: "fixed", statAffected: "DEF" },
	{ name: "Atk", maxPoints: 20, effectPerPoint: 10, effectType: "fixed", statAffected: "ATK" },
	{ name: "HP", maxPoints: 20, effectPerPoint: 100, effectType: "fixed", statAffected: "HP" },
	{ name: "Counter Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Counter Res %" },
	{ name: "Pal Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Pal Res %" },
	{ name: "Skill Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Skill Res %" },
	{ name: "Combo Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Combo Res %" },

	// Nœuds 17 et 18 avec 10 maxPoints
	{ name: "Evasion", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Evasion %" },
	{ name: "Basic Atk Res", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Basic Atk Res %" },

	// Nœud 19 avec 1 maxPoint (effet spécial)
	{ name: "Gale Barrage", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" },

	// Nœuds 20 à 26 avec 20 maxPoints
	{ name: "Healing Amount", maxPoints: 20, effectPerPoint: 1, effectType: "fixed", statAffected: "Healing Amount" },
	{ name: "Atk", maxPoints: 20, effectPerPoint: 10, effectType: "fixed", statAffected: "ATK" },
	{ name: "Def", maxPoints: 20, effectPerPoint: 5, effectType: "fixed", statAffected: "DEF" },
	{ name: "HP", maxPoints: 20, effectPerPoint: 100, effectType: "fixed", statAffected: "HP" },
	{ name: "Combo Regen", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Combo Regen %" },
	{ name: "Ignore Launch", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Ignore Launch %" },
	{ name: "Combo Dmg", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Combo Dmg %" },

	// Nœuds 27 et 28 avec 10 maxPoints
	{ name: "Atk Spd", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "ATK SPD" },
	{ name: "Ignore Stun", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Stun %" },

	// Nœud 29 avec 1 maxPoint (effet spécial)
	{ name: "Final Shot", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" }
  ];


  const sorceryNodes = [
	// Nœuds 0 à 6 avec 20 maxPoints
	{ name: "Atk", maxPoints: 20, effectPerPoint: 10, effectType: "fixed", statAffected: "ATK" },
	{ name: "HP", maxPoints: 20, effectPerPoint: 100, effectType: "fixed", statAffected: "HP" },
	{ name: "Def", maxPoints: 20, effectPerPoint: 5, effectType: "fixed", statAffected: "DEF" },
	{ name: "Skill Dmg", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Skill Dmg %" },
	{ name: "Ignore Launch", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Launch %" },
	{ name: "Wound", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Wound %" },
	{ name: "Skill Crit Dmg", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Skill Crit Dmg %" },

	// Nœuds 7 et 8 avec 10 maxPoints
	{ name: "Ignore Evasion", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Evasion %" },
	{ name: "Ignore Counter", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Counter %" },

	// Nœud 9 avec 1 maxPoint (effet spécial)
	{ name: "Temporal Compression", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" },

	// Nœuds 10 à 16 avec 20 maxPoints
	{ name: "Def", maxPoints: 20, effectPerPoint: 5, effectType: "fixed", statAffected: "DEF" },
	{ name: "Atk", maxPoints: 20, effectPerPoint: 10, effectType: "fixed", statAffected: "ATK" },
	{ name: "HP", maxPoints: 20, effectPerPoint: 100, effectType: "fixed", statAffected: "HP" },
	{ name: "Counter Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Counter Res %" },
	{ name: "Pal Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Pal Res %" },
	{ name: "Skill Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Skill Res %" },
	{ name: "Combo Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Combo Res %" },

	// Nœuds 17 et 18 avec 10 maxPoints
	{ name: "Evasion", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Evasion %" },
	{ name: "Basic Atk Res", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Basic Atk Res %" },

	// Nœud 19 avec 1 maxPoint (effet spécial)
	{ name: "Endless Outburst", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" },

	// Nœuds 20 à 26 avec 20 maxPoints
	{ name: "Stun", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Stun %" },
	{ name: "Energy Regen", maxPoints: 20, effectPerPoint: 1, effectType: "fixed", statAffected: "Energy Regen" },
	{ name: "Skill Regen", maxPoints: 20, effectPerPoint: 1, effectType: "fixed", statAffected: "Skill Regen" },
	{ name: "Skill Dmg", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Skill Dmg %" },
	{ name: "Crit Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Crit Res %" },
	{ name: "Ignore Counter", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Ignore Counter %" },
	{ name: "Ignore Evasion", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Ignore Evasion %" },

	// Nœuds 27 et 28 avec 10 maxPoints
	{ name: "Atk", maxPoints: 10, effectPerPoint: 10, effectType: "fixed", statAffected: "ATK" },
	{ name: "Def", maxPoints: 10, effectPerPoint: 5, effectType: "fixed", statAffected: "DEF" },

	// Nœud 29 avec 1 maxPoint (effet spécial)
	{ name: "Final Arcane", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" }
  ];


  const beastNodes = [
	// Nœuds 0 à 6 avec 20 maxPoints
	{ name: "HP", maxPoints: 20, effectPerPoint: 100, effectType: "fixed", statAffected: "HP" },
	{ name: "Def", maxPoints: 20, effectPerPoint: 5, effectType: "percentage", statAffected: "DEF" },
	{ name: "Atk", maxPoints: 20, effectPerPoint: 10, effectType: "fixed", statAffected: "ATK" },
	{ name: "Pal Crit Dmg", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Pal Crit Dmg %" },
	{ name: "Pal Dmg", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Pal Dmg %" },
	{ name: "Evasion", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Evasion %" },
	{ name: "Regeneration", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Regeneration %" },

	// Nœuds 7 et 8 avec 10 maxPoints
	{ name: "Ignore Evasion", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Evasion %" },
	{ name: "Pal Ignore Evasion", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Pal Ignore Evasion %" },

	// Nœud 9 avec 1 maxPoint (effet spécial)
	{ name: "Crimson Spirit", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" },

	// Nœuds 10 à 16 avec 20 maxPoints
	{ name: "Def", maxPoints: 20, effectPerPoint: 5, effectType: "fixed", statAffected: "DEF" },
	{ name: "Atk", maxPoints: 20, effectPerPoint: 10, effectType: "fixed", statAffected: "ATK" },
	{ name: "HP", maxPoints: 20, effectPerPoint: 100, effectType: "fixed", statAffected: "HP" },
	{ name: "Counter Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Counter Res %" },
	{ name: "Pal Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Pal Res %" },
	{ name: "Skill Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Skill Res %" },
	{ name: "Combo Res", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Combo Res %" },

	// Nœuds 17 et 18 avec 10 maxPoints
	{ name: "Evasion", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Evasion %" },
	{ name: "Basic Atk Res", maxPoints: 10, effectPerPoint: 1, effectType: "percentage", statAffected: "Basic Atk Res %" },

	// Nœud 19 avec 1 maxPoint (effet spécial)
	{ name: "Assisted Combo", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" },

	// Nœuds 20 à 26 avec 20 maxPoints
	{ name: "Launch", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Launch %" },
	{ name: "Pal Regen", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Pal Regen %" },
	{ name: "Wound", maxPoints: 20, effectPerPoint: 0.5, effectType: "percentage", statAffected: "Wound %" },
	{ name: "Pal Dmg", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Pal Dmg %" },
	{ name: "Pal Atk Spd", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Pal Atk Spd %" },
	{ name: "Pal Ignore Evasion", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Pal Ignore Evasion %" },
	{ name: "Ignore Evasion", maxPoints: 20, effectPerPoint: 1, effectType: "percentage", statAffected: "Ignore Evasion %" },

	// Nœuds 27 et 28 avec 10 maxPoints
	{ name: "Atk", maxPoints: 10, effectPerPoint: 10, effectType: "fixed", statAffected: "ATK" },
	{ name: "Def", maxPoints: 10, effectPerPoint: 5, effectType: "fixed", statAffected: "DEF" },

	// Nœud 29 avec 1 maxPoint (effet spécial)
	{ name: "Final Roar", maxPoints: 1, effectPerPoint: 10, effectType: "special", statAffected: "Special effect" }
  ];


  // Gestion des points pour chaque branche
  const [branchPoints, setBranchPoints] = useState({
	Fury: furyNodes.map(() => 0), // Initialiser les points de chaque nœud pour Fury
    Archery: archeryNodes.map(() => 0), // Initialiser les points de chaque nœud pour Archery
    Sorcery: sorceryNodes.map(() => 0), // Initialiser les points de chaque nœud pour Sorcery
	Beast: beastNodes.map(() => 0), // Initialiser les points de chaque nœud pour Beast
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
        prevStats[statAffected] + effectPerPoint,
    }));
  };

  const renderBranch = () => {
    switch (selectedBranch) {
		case "Fury":
			return (
				<TalentBranch
				  key="Fury"
				  branchName="Fury"
				  nodes={furyNodes}
				  points={branchPoints.Fury}
				  onUpdatePoints={updatePoints}
				/>
			);
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

		case "Beast":
			return (
				<TalentBranch
				  key="Tame Beasts"
				  branchName="Beast"
				  nodes={beastNodes}
				  points={branchPoints.Beast}
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
        <button onClick={() => setSelectedBranch("Archery")}>Archery</button>
        <button onClick={() => setSelectedBranch("Sorcery")}>Sorcery</button>
        <button onClick={() => setSelectedBranch("Beast")}>Tame Beasts</button>
        <button onClick={() => setSelectedBranch("Fury")}>Fury</button>
      </div>

      {/* Affichage de la branche sélectionnée */}
     <div className={styles.generatorContainer}>
     	 <TransformWrapper
	        defaultScale={1}
			initialScale={3}
	        wheel={{ step: 0.1 }}
	        pinch={{ step: 5 }}
	        doubleClick={{ disabled: true }}
			initialPositionX={-1000}
			initialPositionY={-1000}
			className={styles.className}
	      >
	        <TransformComponent>
	          <div className={styles.talentTreeContainer}>{renderBranch()}</div>
	        </TransformComponent>
	      </TransformWrapper>
     </div>

      <div className={styles.statsContainer}>
        <h3>Stats Globales</h3>
        <ul>
          {Object.entries(globalStats).map(([statName, value]) => (
            <li key={statName}>
              {statName}: {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TalentTree;
