import React from "react";
import Image from "next/image";
import styles from "./SetTalent.module.css";
import TalentTree from '../TalentTree/TalentTree';

const SetTalent = ({ talentImage, talents, title }) => {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.content}>
        <h5>Brief explanation:</h5>
        <div className={styles.imageContainer}>
          {talentImage && <Image
            src={talentImage}
            className={styles.image}
            alt="Pal"
            width={446}
            height={270}
          />}
        </div>
        <p dangerouslySetInnerHTML={{ __html: talents }}></p>
		{/* <TalentTree /> */}
      </div>
    </div>
  );
};

export default SetTalent;
