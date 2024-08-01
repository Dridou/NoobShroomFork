import React from "react";
import Image from "next/image";
import styles from "./SetSpell.module.css";

const SetSpell = ({
  standardImage,
  opponentImage,
  opponentSpells,
  explanation,
  timings,
  alternatives,
}) => {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Spells</h4>
      <div className={styles.mainSpells}>
        <div className={styles.imageContainer}>
        	<Image
	          src={standardImage}
	          className={styles.setImage}
	          alt="Spells and timing"
	          width={609}
	          height={154}
	        />
        </div>
      </div>
      <div className={styles.setDetails}>
        <h5 className={styles.subTitle}>Oponnent spells ({opponentSpells}):</h5>
          <div className={styles.imageContainer}>
          	<Image
	            src={opponentImage}
	            className={styles.setImageSmall}
	            alt="Opponent spells"
	            width={609}
	            height={109}
	          />
          </div>
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
