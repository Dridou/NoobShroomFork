"use client"; // Indique que ce composant est côté client

import React, { useState, useEffect} from "react";
import TalentBranch from "../TalentBranch/TalentBranch";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCopy } from '@fortawesome/free-solid-svg-icons';
import styles from "./TalentTree.module.css"; // Module CSS
import Image from "next/image";

const TalentTree = () => {
  // Définir des nœuds pour chaque branche

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
      name: "Rampage",
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
      name: "Final Blow",
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
      name: "Final Shot",
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
      name: "Endless Outburst",
      maxPoints: 1,
      effectPerPoint: 10,
      effectType: "special",
      statAffected: "Special effect",
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
      name: "Final Arcane",
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

  // Fonction pour mettre à jour le nombre de plumes maximum
  const handleMaxFeathersChange = (newMaxFeathers) => {
    if (!isNaN(newMaxFeathers) && newMaxFeathers >= 0) {
      setMaxFeathers(newMaxFeathers);
      setPlayerFeathers(newMaxFeathers); // Réinitialiser les plumes actuelles au nouveau max
    }
  };

  const [dungeon, setDungeon] = useState('');
  const [threshold, setThreshold] = useState('');

  const [dungeons, setDungeons] = useState([]);
  const [thresholds, setThresholds] = useState([]);
  const [readOnlyFeathers, setReadOnlyFeathers] = useState(false); // Nouveau state pour gérer l'état readonly

  const [loading, setLoading] = useState(false);


  const [temporaryLink, setTemporaryLink] = useState('');

  const getConfigFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const config = urlParams.get('config');
    if (config) {
      try {
        const decodedConfig = JSON.parse(decodeURIComponent(config));
        setBranchPoints(decodedConfig.branchPoints); // Charger la configuration des talents
        setMaxFeathers(decodedConfig.maxFeathers); // Charger le nombre de plumes
		setPlayerFeathers(decodedConfig.playerFeathers); // Charger le nombre de plumes actuelles
        setReadOnlyFeathers(true); // Mettre le champ des plumes en readonly
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration', error);
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
      maxFeathers,  // Ajout des plumes dans la configuration
	  playerFeathers
    };

    const configString = JSON.stringify(configData); // Convertir la configuration en JSON
    const encodedConfig = encodeURIComponent(configString); // Encoder la chaîne JSON
    const link = `${window.location.origin}/posts/talent-generator?config=${encodedConfig}`;
    setTemporaryLink(link);
    navigator.clipboard.writeText(link); // Copier le lien dans le presse-papiers
    alert('Lien de build copié dans le presse-papiers');
  };

  useEffect(() => {
    const loadDungeons = async () => {
      try {
        const response = await fetch('/api/dungeons');
        const data = await response.json();
        if (response.ok) {
          setDungeons(data);
        } else {
          console.error('Error fetching dungeons:', data.error);
        }
      } catch (error) {
        console.error('Error fetching dungeons:', error);
      }
    };

    loadDungeons();
  }, []);

  // Charger les seuils lorsque le donjon est sélectionné
  useEffect(() => {
    const loadThresholds = async () => {
      if (dungeon) {
        try {
          const response = await fetch(`/api/thresholds/${dungeon}`);
          const data = await response.json();
          if (response.ok) {
            setThresholds(data);
          } else {
            console.error('Error fetching thresholds:', data.error);
          }
        } catch (error) {
          console.error('Error fetching thresholds:', error);
        }
      }
    };

    loadThresholds();
  }, [dungeon]);

   // Charger les talents depuis l'API lorsque le donjon et le seuil sont sélectionnés
   useEffect(() => {
    if (dungeon && threshold) {
      loadTalentConfig(dungeon, threshold);
    }
  }, [dungeon, threshold]);

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
  };

  // Sauvegarder l'état des branches dans un fichier JSON
  const saveTalentTree = () => {
	// Créer l'objet au format configData
	const configData = {
	  maxFeathers: maxFeathers, // Le nombre maximum de plumes
	  branchPoints: branchPoints // L'état actuel des points dans chaque branche
	};

	// Convertir l'objet en une chaîne JSON
	const dataStr =
	  "data:text/json;charset=utf-8," +
	  encodeURIComponent(JSON.stringify(configData));

	// Créer un élément d'ancre pour le téléchargement
	const downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", "talent_tree.json");

	// Ajouter l'ancre au document et déclencher le téléchargement
	document.body.appendChild(downloadAnchorNode);
	downloadAnchorNode.click();

	// Retirer l'ancre après le téléchargement
	downloadAnchorNode.remove();
  };

  // Charger un fichier JSON pour restaurer l'état des branches et du nombre de plumes
  const loadTalentTree = (event) => {
	const fileReader = new FileReader();

	fileReader.onload = (e) => {
	  const loadedData = JSON.parse(e.target.result);

	  // Vérifier si le fichier contient les bons champs et restaurer les données
	  if (loadedData.maxFeathers !== undefined && loadedData.branchPoints) {
		setMaxFeathers(loadedData.maxFeathers); // Restaurer le nombre de plumes maximum
		setBranchPoints(loadedData.branchPoints); // Restaurer les points dans les branches
	  }
	};

	// Lire le fichier sélectionné
	fileReader.readAsText(event.target.files[0]);
  };

  // Charger les talents depuis l'API
  const loadTalentConfig = async (dungeon, threshold) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/talent?dungeon=${dungeon}&threshold=${threshold}`);
      const data = await response.json();
      if (response.ok) {
        setBranchPoints(data.configData);
      } else {
        console.error('Error loading talent config:', data.message || data.error);
      }
    } catch (error) {
      console.error('Error loading talent config:', error);
    }
    setLoading(false);
  };

  const saveTalentConfig = async () => {
	console.log(dungeon, threshold, branchPoints);
    try {
      const response = await fetch('/api/talent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dungeon,
          threshold,
          configData: branchPoints,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error saving talent config:', data.message || data.error);
      } else {
        console.log('Talent config saved successfully:', data);
      }
    } catch (error) {
      console.error('Error saving talent config:', error);
    }
  };


  const renderBranch = () => {
	console.log(dungeons)

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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.mainContainer}>
      {" "}
      {/* Conteneur principal */}
      <div className={styles.leftContainer}>
        {" "}
        {/* Conteneur pour le header et le générateur */}
        <div className={styles.headerContainer}>
          <div className={styles.buttonRow}>
            {" "}
            {/* Ligne pour les boutons de sauvegarde, chargement et réinitialisation */}
            {/* <button onClick={saveTalentTree}>Save Talent Tree</button> */}
            {/* Bouton de partage avec icône de copie */}
            <button
              onClick={generateTemporaryLink}
              className={styles.shareButton}
            >
            Share this build
            </button>
                {/* Sélection du donjon */}
                <select
                  onChange={(e) => setDungeon(e.target.value)}
                  value={dungeon}
                  disabled={readOnlyFeathers}
                >
                  <option key="default-dungeon" value="" disabled>
                    Select Dungeon
                  </option>
                  {dungeons.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}{" "}
                      {/* Assurez-vous d'afficher la propriété appropriée de l'objet `d` */}
                    </option>
                  ))}
                </select>

                {/* Sélection du seuil */}
                <select
                  onChange={(e) => setThreshold(e.target.value)}
                  value={threshold}
				  disabled={!dungeon || readOnlyFeathers}                >
                  <option key="default-threshold" value="" disabled>
                    Select Threshold
                  </option>
                  {thresholds.map((t) => (
                    <option key={t.id} value={t.value}>
                      {t.value}{" "}
                      {/* Assurez-vous d'afficher la propriété appropriée de l'objet `t` */}
                    </option>
                  ))}
                </select>

                {/* Bouton de sauvegarde */}
                <button
                  onClick={saveTalentConfig}
                  disabled={!dungeon || !threshold}
                >
                  Save Talent Config
                </button>
                <button
                  onClick={() => {
                    window.location.href = `${window.location.origin}/posts/talent-generator`;
                  }}
                >
                  New Build
                </button>
            {/* <button>Load a talent: <input type="file" onChange={loadTalentTree} accept=".json" /></button> */}
            <button onClick={resetAllBranches}>Reset All Branches</button>
          </div>
          <hr />
          <div className={styles.buttonContainer}>
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
            <p>
              {playerFeathers}{" "}
              <Image
                src="/images/items/divine-feather.png"
                width={36}
                height={36}
                alt="Divine feather icon"
              ></Image>
            </p>

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
              onClick={() => setSelectedBranch("Fury")}
              className={`${styles.button} ${
                selectedBranch === "Fury" ? styles.active : ""
              }`}
            >
              Fury
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
            defaultScale={1}
            initialScale={1}
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
            doubleClick={{ disabled: true }}
            initialPositionX={0}
            initialPositionY={0}
            minScale={0.5}
            limitToBounds={false}
            panning={{ velocityDisabled: true }}
          >
            <TransformComponent>
              <div className={styles.talentTreeContainer}>{renderBranch()}</div>
            </TransformComponent>
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
