"use client"; // Indique que ce composant est côté client

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TalentBranch from "../TalentBranch/TalentBranch";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCopy } from '@fortawesome/free-solid-svg-icons';
import styles from "./TalentTree.module.css"; // Module CSS
import Image from "next/image";

const TalentTree = () => {
  // Définir des nœuds pour chaque branche

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Change selon la largeur de ton design mobile
	  console.log("isMobile");
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const furyNodes = [
    // Nœuds 0 à 6 avec 20 maxPoints
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "Counter Dmg %",
      maxPoints: 20,
      effectPerPoint: 25,
      effectType: "percentage",
      statAffected: "Counter Dmg %",
    },
    {
      name: "Healing Amount / Rate",
      maxPoints: 20,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Healing Amount / Rate",
    },
    {
      name: "Crit Res %",
      maxPoints: 20,
      effectPerPoint: 10,
      effectType: "percentage",
      statAffected: "Crit Res %",
    },
    {
      name: "Regeneration",
      maxPoints: 20,
      effectPerPoint: 0.01,
      effectType: "percentage",
      statAffected: "Regeneration %",
    },

    // Nœuds 7 et 8 avec 10 maxPoints
    {
      name: "Ignore Evasion",
      maxPoints: 10,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Ignore Evasion %",
    },
    {
      name: "Ignore Combo",
      maxPoints: 10,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Ignore Combo %",
    },

    // Nœud 9 avec 1 maxPoint (effet spécial)
    {
      name: "Ascension",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
    },

    // Nœuds 10 à 16 avec 20 maxPoints
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },
    {
      name: "Counter Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Counter Res %",
    },
    {
      name: "Pal Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Pal Res %",
    },
    {
      name: "Skill Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Skill Res %",
    },
    {
      name: "Combo Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Combo Res %",
    },

    // Nœuds 17 et 18 avec 10 maxPoints
    {
      name: "Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Evasion %",
    },
    {
      name: "Basic Atk Res %",
      maxPoints: 10,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Basic Atk Res %",
    },

    // Nœud 19 avec 1 maxPoint (effet spécial)
    {
      name: "Regeneration",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
    },

    // Nœuds 20 à 26 avec 20 maxPoints
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },

    {
      name: "Counter Regen",
      maxPoints: 20,
      effectPerPoint: 0.05,
      effectType: "percentage",
      statAffected: "Counter Regen %",
    },
    {
      name: "Basic Atk Dmg",
      maxPoints: 20,
      effectPerPoint: 25,
      effectType: "percentage",
      statAffected: "Basic Atk Dmg %",
    },
    {
      name: "Counter Dmg %",
      maxPoints: 20,
      effectPerPoint: 25,
      effectType: "percentage",
      statAffected: "Counter Dmg %",
    },
    {
      name: "Crit Dmg",
      maxPoints: 20,
      effectPerPoint: 15,
      effectType: "percentage",
      statAffected: "Crit Dmg %",
    },

    // Nœuds 27 et 28 avec 10 maxPoints
    {
      name: "Ignore Combo",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Combo %",
    },
    {
      name: "Ignore Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Evasion %",
    },

    // Nœud 29 avec 1 maxPoint (effet spécial)
    {
      name: "Rampage",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
    },
  ];

  const archeryNodes = [
    // Nœuds 0 à 6 avec 20 maxPoints
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },

    {
      name: "Combo Dmg",
      maxPoints: 20,
      effectPerPoint: 25,
      effectType: "percentage",
      statAffected: "Combo Dmg %",
    },
    {
      name: "Crit Dmg",
      maxPoints: 20,
      effectPerPoint: 15,
      effectType: "percentage",
      statAffected: "Crit Dmg %",
    },
    {
      name: "Evasion",
      maxPoints: 20,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Evasion %",
    },
    {
      name: "Healing amount / rate",
      maxPoints: 20,
      effectPerPoint: 0.2,
      effectType: "percentage",
      statAffected: "Healing Amount / Rate",
    },

    // Nœuds 7 et 8 avec 10 maxPoints
    {
      name: "Ignore Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Evasion %",
    },
    {
      name: "Ignore Stun",
      maxPoints: 10,
      effectPerPoint: 1.5,
      effectType: "percentage",
      statAffected: "Ignore Stun %",
    },

    // Nœud 9 avec 1 maxPoint (effet spécial)
    {
      name: "Eager Momentum",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
    },

    // Nœuds 10 à 16 avec 20 maxPoints
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },

    {
      name: "Counter Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Counter Res %",
    },
    {
      name: "Pal Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Pal Res %",
    },
    {
      name: "Skill Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Skill Res %",
    },
    {
      name: "Combo Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Combo Res %",
    },

    // Nœuds 17 et 18 avec 10 maxPoints
    {
      name: "Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Evasion %",
    },
    {
      name: "Basic Atk Res %",
      maxPoints: 10,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Basic Atk Res %",
    },

    // Nœud 19 avec 1 maxPoint (effet spécial)
    {
      name: "Healing",
      maxPoints: 1,
      effectPerPoint: 0.2,
      effectType: "special",
      statAffected: "Healing Amount",
    },

    // Nœuds 20 à 26 avec 20 maxPoints
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },

    {
      name: "Combo Regen",
      maxPoints: 20,
      effectPerPoint: 0.05,
      effectType: "percentage",
      statAffected: "Combo Regen %",
    },
    {
      name: "Ignore Launch",
      maxPoints: 20,
      effectPerPoint: 0.1,
      effectType: "percentage",
      statAffected: "Ignore Launch %",
    },
    {
      name: "Combo Dmg",
      maxPoints: 20,
      effectPerPoint: 25,
      effectType: "percentage",
      statAffected: "Combo Dmg %",
    },
    {
      name: "Atk Spd",
      maxPoints: 20,
      effectPerPoint: 0.01,
      effectType: "percentage",
      statAffected: "ATK SPD",
    },
    // Nœuds 27 et 28 avec 10 maxPoints

    {
      name: "Ignore Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Evasion %",
    },
    {
      name: "Ignore Stun",
      maxPoints: 10,
      effectPerPoint: 1.5,
      effectType: "percentage",
      statAffected: "Ignore Stun %",
    },

    // Nœud 29 avec 1 maxPoint (effet spécial)
    {
      name: "Gale barrage",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
    },
  ];

  const sorceryNodes = [
    // Nœuds 0 à 6 avec 20 maxPoints
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },

    {
      name: "Skill Dmg",
      maxPoints: 20,
      effectPerPoint: 10,
      effectType: "percentage",
      statAffected: "Skill Dmg %",
    },
    {
      name: "Ignore Launch",
      maxPoints: 20,
      effectPerPoint: 0.1,
      effectType: "percentage",
      statAffected: "Ignore Launch %",
    },
    {
      name: "Wound",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Wound %",
    },
    {
      name: "Skill Crit Dmg",
      maxPoints: 20,
      effectPerPoint: 4,
      effectType: "percentage",
      statAffected: "Skill Crit Dmg %",
    },

    // Nœuds 7 et 8 avec 10 maxPoints
    {
      name: "Ignore Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Evasion %",
    },
    {
      name: "Ignore Counter",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Counter %",
    },

    // Nœud 9 avec 1 maxPoint (effet spécial)
    {
      name: "Temporal Compression",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
    },

    // Nœuds 10 à 16 avec 20 maxPoints
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },

    {
      name: "Counter Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Counter Res %",
    },
    {
      name: "Pal Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Pal Res %",
    },
    {
      name: "Skill Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Skill Res %",
    },
    {
      name: "Combo Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Combo Res %",
    },

    // Nœuds 17 et 18 avec 10 maxPoints
    {
      name: "Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Evasion %",
    },
    {
      name: "Basic Atk Res %",
      maxPoints: 10,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Basic Atk Res %",
    },

    // Nœud 19 avec 1 maxPoint (effet spécial)
    {
      name: "Stun",
      maxPoints: 1,
      effectPerPoint: 15,
      effectType: "percentage",
      statAffected: "Stun %",
    },

    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },

    // Nœuds 20 à 26 avec 20 maxPoints
    {
      name: "Skill Regen %",
      maxPoints: 20,
      effectPerPoint: 0.04,
      effectType: "fixed",
      statAffected: "Skill Regen %",
    },
    {
      name: "Skill Dmg",
      maxPoints: 20,
      effectPerPoint: 10,
      effectType: "percentage",
      statAffected: "Skill Dmg %",
    },
    {
      name: "Skill CD",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Skill CD Reduction %",
    },
    {
      name: "Crit Res %",
      maxPoints: 20,
      effectPerPoint: 10,
      effectType: "percentage",
      statAffected: "Crit Res %",
    },
    {
      name: "Ignore Counter",
      maxPoints: 20,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Counter %",
    },
    {
      name: "Ignore Evasion",
      maxPoints: 20,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Evasion %",
    },

    // Nœud 29 avec 1 maxPoint (effet spécial)
    {
      name: "Endless Outburst",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
    },
  ];

  const beastNodes = [
    // Nœuds 0 à 6 avec 20 maxPoints
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "Pal Crit Dmg",
      maxPoints: 20,
      effectPerPoint: 4,
      effectType: "percentage",
      statAffected: "Pal Crit Dmg %",
    },
    {
      name: "Pal Dmg",
      maxPoints: 20,
      effectPerPoint: 10,
      effectType: "percentage",
      statAffected: "Pal Dmg %",
    },
    {
      name: "Evasion",
      maxPoints: 20,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Evasion %",
    },
    {
      name: "Regeneration",
      maxPoints: 20,
      effectPerPoint: 0.01,
      effectType: "percentage",
      statAffected: "Regeneration %",
    },

    // Nœuds 7 et 8 avec 10 maxPoints
    {
      name: "Ignore Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Evasion %",
    },
    {
      name: "Pal Ignore Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Pal Ignore Evasion %",
    },

    // Nœud 9 avec 1 maxPoint (effet spécial)
    {
      name: "Crimson Spirit",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
    },

    // Nœuds 10 à 16 avec 20 maxPoints
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },
    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },
    {
      name: "Counter Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Counter Res %",
    },
    {
      name: "Pal Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Pal Res %",
    },
    {
      name: "Skill Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Skill Res %",
    },
    {
      name: "Combo Res %",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Combo Res %",
    },

    // Nœuds 17 et 18 avec 10 maxPoints
    {
      name: "Evasion",
      maxPoints: 10,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Evasion %",
    },
    {
      name: "Basic Atk Res %",
      maxPoints: 10,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Basic Atk Res %",
    },

    // Nœud 19 avec 1 maxPoint (effet spécial)
    {
      name: "Launch",
      maxPoints: 1,
      effectPerPoint: 4,
      effectType: "special",
      statAffected: "Launch %",
    },

    {
      name: "ATK %",
      maxPoints: 20,
      effectPerPoint: 400,
      effectType: "percentage",
      statAffected: "ATK %",
    },
    {
      name: "HP %",
      maxPoints: 20,
      effectPerPoint: 600,
      effectType: "percentage",
      statAffected: "HP %",
    },
    {
      name: "DEF %",
      maxPoints: 20,
      effectPerPoint: 1200,
      effectType: "percentage",
      statAffected: "DEF %",
    },

    {
      name: "Pal Regen",
      maxPoints: 20,
      effectPerPoint: 0.02,
      effectType: "percentage",
      statAffected: "Pal Regen %",
    },
    {
      name: "Wound",
      maxPoints: 20,
      effectPerPoint: 0.5,
      effectType: "percentage",
      statAffected: "Wound %",
    },
    {
      name: "Pal Dmg",
      maxPoints: 20,
      effectPerPoint: 10,
      effectType: "percentage",
      statAffected: "Pal Dmg %",
    },
    {
      name: "Pal Atk Spd",
      maxPoints: 20,
      effectPerPoint: 1,
      effectType: "percentage",
      statAffected: "Pal Atk Spd %",
    },

    {
      name: "Pal Ignore Evasion",
      maxPoints: 20,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Pal Ignore Evasion %",
    },
    {
      name: "Ignore Evasion",
      maxPoints: 20,
      effectPerPoint: 2,
      effectType: "percentage",
      statAffected: "Ignore Evasion %",
    },

    {
      name: "Assisted Combo",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
    },
  ];

  // Plumes utilisées dans l'arbre
  const [playerFeathers, setPlayerFeathers] = useState(20000); // Plumes actuelles disponibles
  const [maxFeathers, setMaxFeathers] = useState(20000); // Max plumes disponibles
  const [branchFeathers, setBranchFeathers] = useState({
	Fury: 0,
	Archery: 0,
	Sorcery: 0,
	Beast: 0,
  });

  // Fonction pour mettre à jour le nombre de plumes maximum
  const handleMaxFeathersChange = (newMaxFeathers) => {
    if (!isNaN(newMaxFeathers) && newMaxFeathers >= 0) {
      setMaxFeathers(newMaxFeathers);
      setPlayerFeathers(newMaxFeathers); // Réinitialiser les plumes actuelles au nouveau max
    }
  };

  const [builds, setBuilds] = useState([]); // State to hold the builds for the selected class
  const [selectedBuild, setSelectedBuild] = useState(""); // State for the selected build
  const [characterClass, setCharacterClass] = useState("");
  const [readOnlyFeathers, setReadOnlyFeathers] = useState(false); // Nouveau state pour gérer l'état readonly
  const [loading, setLoading] = useState(false);
  const [temporaryLink, setTemporaryLink] = useState("");

  // Fetch builds when a class is selected
  useEffect(() => {
    if (characterClass) {
      fetchBuildsForClass(characterClass);
    }
  }, [characterClass]);

  const fetchBuildsForClass = async (className) => {
    try {
      const response = await fetch(`/api/talent?class=${className}`);
      const data = await response.json();
      if (response.ok) {
        setBuilds(data); // Populate the builds array
      } else {
        console.error("Error fetching builds:", data.error);
      }
    } catch (error) {
      console.error("Error fetching builds:", error);
    }
  };

  const handleBuildChange = async (buildId) => {
    setSelectedBuild(buildId);
    try {
      const response = await fetch(`/api/talent?id=${buildId}`); // Fetch the selected build's config
      const buildData = await response.json();
      if (response.ok) {
        setMaxFeathers(buildData.maxFeathers); // Load the build's feather count
        // setCharacterClass(buildData.characterClass); // Load the build's class
        setBranchPoints(buildData.configData); // Load the build's talent points
        setPlayerFeathers(0);
        // Recalculer les statistiques globales après avoir chargé les points
        recalculateGlobalStats(buildData.configData);
      } else {
        console.error("Error loading build:", buildData.error);
      }
    } catch (error) {
      console.error("Error loading build:", error);
    }
  };

  const getConfigFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const config = urlParams.get("config");
    const classParam = urlParams.get("class");
    const buildParam = urlParams.get("build");

    if (config) {
      try {
        const decodedConfig = JSON.parse(decodeURIComponent(config));
        setBranchPoints(decodedConfig.branchPoints); // Charger la configuration des talents
        setMaxFeathers(decodedConfig.maxFeathers); // Charger le nombre de plumes
        setPlayerFeathers(decodedConfig.playerFeathers); // Charger le nombre de plumes actuelles
        setCharacterClass(decodedConfig.characterClass); // Charger la classe
        setReadOnlyFeathers(true); // Mettre le champ des plumes en readonly
        // Recalculer les statistiques globales après avoir chargé les points
        recalculateGlobalStats(decodedConfig.branchPoints);
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration", error);
      }
    } else {
      if (classParam) {
        setCharacterClass(classParam);
      }
      if (buildParam) {
        setSelectedBuild(buildParam);
        handleBuildChange(buildParam);
      }
    }
  };

  useEffect(() => {
    // Charger la configuration depuis l'URL si elle est présente
    getConfigFromURL();
  }, []);

  const generateTemporaryLink = () => {
    const configData = {
      branchPoints, // Ta configuration actuelle des points de talent
      maxFeathers, // Ajout des plumes dans la configuration
      playerFeathers,
      characterClass,
    };

    const configString = JSON.stringify(configData); // Convertir la configuration en JSON
    const encodedConfig = encodeURIComponent(configString); // Encoder la chaîne JSON
    const link = `${window.location.origin}/posts/talent-generator?config=${encodedConfig}`;
    setTemporaryLink(link);
    navigator.clipboard.writeText(link); // Copier le lien dans le presse-papiers
    alert("Lien de build copié dans le presse-papiers");
  };

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetch("/api/classes");
        const data = await response.json();
        if (response.ok) {
          setCharacterClass(data[0]?.name || ""); // Sélectionner par défaut la première classe
        } else {
          console.error("Error fetching classes:", data.error);
        }
      } catch (error) {
        console.error("Error fetching class:", error);
      }
    };

    loadClasses();
  }, []);

  // Gestion des points pour chaque branche
  const [branchPoints, setBranchPoints] = useState({
    Fury: furyNodes.map(() => 0), // Initialiser les points de chaque nœud pour Fury
    Archery: archeryNodes.map(() => 0), // Initialiser les points de chaque nœud pour Archery
    Sorcery: sorceryNodes.map(() => 0), // Initialiser les points de chaque nœud pour Sorcery
    Beast: beastNodes.map(() => 0), // Initialiser les points de chaque nœud pour Beast
  });

  // Gestion des statistiques globales
  const [globalStats, setGlobalStats] = useState({
    // stats
    "HP %": 0,
    "DEF %": 0,
    "ATK %": 0,
    "ATK SPD": 0,

    "Stun %": 0,
    "Evasion %": 0,
    "Regeneration %": 0,
    "Ignore Stun %": 0,
    "Ignore Evasion %": 0,
    "Ignore Combo %": 0,
    "Ignore Counter %": 0,

    "Crit Dmg %": 0,
    "Crit Res %": 0,

    "Basic Atk Dmg %": 0,
    "Basic Atk Res %": 0,

    "Combo Dmg %": 0,
    "Combo Res %": 0,

    "Counter Dmg %": 0,
    "Counter Res %": 0,

    "Launch %": 0,
    "Ignore Launch %": 0,

    "Skill Crit Dmg %": 0,
    "Skill Dmg %": 0,
    "Skill Res %": 0,

    "Pal Dmg %": 0,
    "Pal Res %": 0,
    "Healing Rate %": 0,
    "Healing Amount %": 0,

    "Skill CD Reduction %": 0,
    "Wound %": 0,
    "Counter Regen %": 0,
    "Combo Regen %": 0,
    "Pal Regen %": 0,
    "Skill Regen %": 0,

    "Pal Crit Dmg %": 0,
    "Pal Atk Spd %": 0,
    "Pal Ignore Evasion %": 0,

    "ATK SPD": 0,
  });

  useEffect(() => {
	recalculateGlobalStats(branchPoints);
  }, [branchPoints]);

  const recalculateGlobalStats = (branchPoints) => {
    // Initialiser les stats à zéro
    const newStats = {
      "HP %": 0,
      "DEF %": 0,
      "ATK %": 0,
      "ATK SPD": 0,

      "Stun %": 0,
      "Evasion %": 0,
      "Regeneration %": 0,
      "Ignore Stun %": 0,
      "Ignore Evasion %": 0,
      "Ignore Combo %": 0,
      "Ignore Counter %": 0,

      "Crit Dmg %": 0,
      "Crit Res %": 0,

      "Basic Atk Dmg %": 0,
      "Basic Atk Res %": 0,

      "Combo Dmg %": 0,
      "Combo Res %": 0,

      "Counter Dmg %": 0,
      "Counter Res %": 0,

      "Launch %": 0,
      "Ignore Launch %": 0,

      "Skill Crit Dmg %": 0,
      "Skill Dmg %": 0,
      "Skill Res %": 0,

      "Pal Dmg %": 0,
      "Pal Res %": 0,
      "Healing Rate %": 0,
      "Healing Amount %": 0,

      "Skill CD Reduction %": 0,
      "Wound %": 0,
      "Counter Regen %": 0,
      "Combo Regen %": 0,
      "Pal Regen %": 0,
      "Skill Regen %": 0,

      "Pal Crit Dmg %": 0,
      "Pal Atk Spd %": 0,
      "Pal Ignore Evasion %": 0,

      "ATK SPD": 0,
    };

    const branches = {
      Fury: furyNodes,
      Archery: archeryNodes,
      Sorcery: sorceryNodes,
      Beast: beastNodes,
    };

    Object.keys(branchPoints).forEach((branch) => {
      const branchData = branches[branch];
      const points = branchPoints[branch];

      points.forEach((pointsForNode, index) => {
        const node = branchData[index];
        const { statAffected, effectPerPoint } = node;

        newStats[statAffected] += pointsForNode * effectPerPoint;
      });
    });

    // Mettre à jour les statistiques globales
    setGlobalStats(newStats);
  };

  // Branche actuellement sélectionnée
  const [selectedBranch, setSelectedBranch] = useState("Fury");

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
        index === nodeIndex ? points + newPoints : points
      ),
    }));


    // Mise à jour des statistiques globales
    setGlobalStats((prevStats) => ({
      ...prevStats,
      [statAffected]: prevStats[statAffected] + effectPerPoint,
    }));
  };

  // Fonction pour réinitialiser une branche
  const resetBranch = (branchName) => {
    setBranchPoints((prevPoints) => ({
      ...prevPoints,
      [branchName]: prevPoints[branchName].map(() => 0),
    }));

	// Restituer les plumes utilisées dans cette branche
	setPlayerFeathers((prevFeathers) => prevFeathers + branchFeathers[branchName]);

	// Réinitialiser les plumes de la branche
	setBranchFeathers((prevBranchFeathers) => ({
	  ...prevBranchFeathers,
	  [branchName]: 0,
	}));

	// recalculateGlobalStats(branchPoints); // useState
  };

  // Fonction pour réinitialiser toutes les branches
  const resetAllBranches = () => {
    setBranchPoints({
      Fury: furyNodes.map(() => 0),
      Archery: archeryNodes.map(() => 0),
      Sorcery: sorceryNodes.map(() => 0),
      Beast: beastNodes.map(() => 0),
    });
    setGlobalStats({
      "HP %": 0,
      "DEF %": 0,
      "ATK %": 0,
      "ATK SPD": 0,

      "Stun %": 0,
      "Evasion %": 0,
      "Regeneration %": 0,
      "Ignore Stun %": 0,
      "Ignore Evasion %": 0,
      "Ignore Combo %": 0,
      "Ignore Counter %": 0,

      "Crit Dmg %": 0,
      "Crit Res %": 0,

      "Basic Atk Dmg %": 0,
      "Basic Atk Res %": 0,

      "Combo Dmg %": 0,
      "Combo Res %": 0,

      "Counter Dmg %": 0,
      "Counter Res %": 0,

      "Launch %": 0,
      "Ignore Launch %": 0,

      "Skill Crit Dmg %": 0,
      "Skill Dmg %": 0,
      "Skill Res %": 0,

      "Pal Dmg %": 0,
      "Pal Res %": 0,
      "Healing Rate %": 0,
      "Healing Amount %": 0,

      "Skill CD Reduction %": 0,
      "Wound %": 0,
      "Counter Regen %": 0,
      "Combo Regen %": 0,
      "Pal Regen %": 0,
      "Skill Regen %": 0,

      "Pal Crit Dmg %": 0,
      "Pal Atk Spd %": 0,
      "Pal Ignore Evasion %": 0,

      "ATK SPD": 0,
    });
    setPlayerFeathers(maxFeathers);
    window.location.href = `${window.location.origin}/posts/talent-generator`;
  };

  // Charger les talents depuis l'API
  const loadTalentConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/talent?class=${characterClass}`);
      const data = await response.json();
      if (response.ok) {
        setBranchPoints(data.configData);
      } else {
        console.error(
          "Error loading talent config:",
          data.message || data.error
        );
      }
    } catch (error) {
      console.error("Error loading talent config:", error);
    }
    setLoading(false);
  };

  const saveTalentConfig = async () => {
	if (!isUserAuthorized)
	{
		alert("User not authorized to save talent config");
		return;
	}
    try {
      const response = await fetch("/api/talent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterClass, // On enregistre la configuration pour la classe
          maxFeathers,
          configData: branchPoints,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(
          "Error saving talent config:",
          data.message || data.error
        );
      } else {
        console.log("Talent config saved successfully:", data);
      }
    } catch (error) {
      console.error("Error saving talent config:", error);
    }
  };

  const { data: session, status } = useSession();

  // Liste des emails des utilisateurs autorisés
  const authorizedUsers = [
    "aneboncarle@hotmail.fr"
  ];

  const isUserAuthorized = session?.user?.email && authorizedUsers.includes(session.user.email);



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
            onResetBranch={resetBranch}
            playerFeathers={playerFeathers}
            setPlayerFeathers={setPlayerFeathers}
			setBranchFeathers={setBranchFeathers}
			setBranchPoints={setBranchPoints}
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
            onResetBranch={resetBranch}
            playerFeathers={playerFeathers}
            setPlayerFeathers={setPlayerFeathers}
			setBranchFeathers={setBranchFeathers}
			setBranchPoints={setBranchPoints}
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
            onResetBranch={resetBranch}
            playerFeathers={playerFeathers}
            setPlayerFeathers={setPlayerFeathers}
			setBranchFeathers={setBranchFeathers}
			setBranchPoints={setBranchPoints}
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
            onResetBranch={resetBranch}
            playerFeathers={playerFeathers}
            setPlayerFeathers={setPlayerFeathers}
			setBranchFeathers={setBranchFeathers}
			setBranchPoints={setBranchPoints}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.mainContainer}>
      {/* Conteneur principal */}
      <div className={styles.leftContainer}>
        {/* Conteneur pour le header et le générateur */}
        <div className={styles.headerContainer}>
          <p className={styles.title}>Parameters</p>
          <div className={styles.buttonRow}>
            <button onClick={generateTemporaryLink}>Share this build</button>
            <button
              onClick={saveTalentConfig}
              disabled={!isUserAuthorized}
              //   disabled={!characterClass}
            >
              Save Talent Config
            </button>
            <button onClick={resetAllBranches}>Reset All Branches</button>
          </div>
          <hr />
          <p className={styles.title}>Build creation</p>
          <div className={styles.buttonContainer}>
            <div className={styles.featherContainer}>
              <div className={styles.customInput}>
                Max feather:{" "}
                <input
                  type="number"
                  value={maxFeathers}
                  onChange={(e) =>
                    handleMaxFeathersChange(parseInt(e.target.value, 10))
                  }
                  min="0"
                  max="100000"
                  placeholder="Enter your max feathers"
                  disabled={readOnlyFeathers}
                />
              </div>
              <div>
                Remaining : {playerFeathers}{" "}
                <Image
                  src="/images/items/divine-feather.png"
                  width={36}
                  height={36}
                  alt="Divine feather icon"
                ></Image>
              </div>
            </div>
            {/* Sélecteur de classe */}
            <div className={styles.classSelection}>
              <select
                onChange={(e) => setCharacterClass(e.target.value)}
                value={characterClass}
                disabled={readOnlyFeathers}
              >
                <option key="default-class" value="" disabled>
                  Class
                </option>
                {/* Remplacer cette ligne par la liste des classes */}
                <option value="Prophet">Prophet</option>
                <option value="Darklord">Darklord</option>
                <option value="Sacred Hunter">Sacred Hunter</option>
                <option value="Plume Monarch">Plume Monarch</option>
                <option value="Berserker">Berserker</option>
                <option value="Martial Saint">Martial Saint</option>
                <option value="Beast Master">Beast Master</option>
                <option value="Supreme Spirit">Supreme Spirit</option>
                {/* Ajouter d'autres classes ici */}
              </select>
              <select
                onChange={(e) => handleBuildChange(e.target.value)}
                value={selectedBuild || ""}
                disabled={!characterClass}
              >
                <option key="default-build" value="" disabled>
                  Official builds
                </option>
                {builds.map((build) => (
                  <option key={build.id} value={build.id}>
                    {build.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.branchSelection}>
            <button
              onClick={() => setSelectedBranch("Fury")}
              className={`${styles.button} ${
                selectedBranch === "Fury" ? styles.active : ""
              }`}
            >
              Fury
            </button>
            <button
              onClick={() => setSelectedBranch("Archery")}
              className={`${styles.button} ${
                selectedBranch === "Archery" ? styles.active : ""
              }`}
            >
              Archery
            </button>
            <button
              onClick={() => setSelectedBranch("Sorcery")}
              className={`${styles.button} ${
                selectedBranch === "Sorcery" ? styles.active : ""
              }`}
            >
              Sorcery
            </button>
            <button
              onClick={() => setSelectedBranch("Beast")}
              className={`${styles.button} ${
                selectedBranch === "Beast" ? styles.active : ""
              }`}
            >
              Tame Beasts
            </button>
          </div>
        </div>
        <div className={styles.generatorContainer}>
          <TransformWrapper
            defaultScale={isMobile ? 0.2 : 1}
			initialScale={isMobile ? 0.2 : 1}
            minScale={isMobile ? 0.2 : 1}
            maxScale={isMobile ? 2.5 : 2}
			initialPositionX={isMobile ? -350 : 0} // Ajuste la position initiale en X
      		initialPositionY={isMobile ? -350 : 0} // Ajuste la position initiale en Y
			//   limitToBounds={false}
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
            doubleClick={{ disabled: true }}
            panning={{ velocityDisabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <div>
                <div className={styles.toolbar}>
                  <div className={styles.tools}>
                    <button onClick={() => zoomIn()}>Zoom +</button>
                    <button onClick={() => zoomOut()}>Zoom -</button>
                    <button onClick={() => resetTransform()}>Center</button>
                  </div>
                  <div className={styles.tools}>
                    <button onClick={() => resetBranch(selectedBranch)}>
                      Reset Branch
                    </button>
                  </div>
                </div>
                <TransformComponent>
                  <div className={styles.talentTreeContainer}>
                    {renderBranch()}
                  </div>
                </TransformComponent>
              </div>
            )}
          </TransformWrapper>
        </div>
      </div>
      <div className={styles.statsContainer}>
        {" "}
        {/* Conteneur pour les statistiques globales */}
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
