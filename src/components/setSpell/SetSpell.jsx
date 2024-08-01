import React from 'react';
import Image from "next/image";
import styles from "./setSpell.module.css";

const SetSpell = ({ standardImage, opponentImage, opponentSpells, explanation, timings, alternatives }) => {
  return (
    <div>
      <h4 className={styles.setDivTitle}>Spells</h4>
      <div className={styles.setImageContainer}>
        <Image src={standardImage} className={styles.setImage} alt="Spells and timing" width={20} height={20}  />
      </div>
      <div className={styles.setDetails}>
        <h5>Oponnent spells ({opponentSpells}):</h5>
        <Image src={opponentImage} className={styles.setImageSmall} alt="Opponent spells" width={20} height={20} />
        <h5>Brief explanation:</h5>
        <p>{explanation}</p>
        <h5>Timings:</h5>
        <p dangerouslySetInnerHTML={{ __html: timings }}></p>
        <h5>Alternatives:</h5>
        <p dangerouslySetInnerHTML={{ __html: alternatives }}></p>
      </div>
    </div>
  );
};

export default SetSpell;
