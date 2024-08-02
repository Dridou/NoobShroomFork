import React from "react";
import Image from "next/image";
import styles from "./SetPal.module.css";

const SetPal = ({ palsImage, palsAlternatives }) => {
	  return (
	<div className={styles.container}>
	  <h4 className={styles.title}>Pals</h4>
	  <div className={styles.mainPal}>
		<div className={styles.imageContainer}>
			<Image
	          src={palsImage}
	          className={styles.setImage}
	          alt="Pal"
	          width={609}
	          height={154}
	        />
		</div>
	  </div>
	  <div className={styles.setDetails}>
		<h5>Alternatives:</h5>
		<p dangerouslySetInnerHTML={{ __html: palsAlternatives }}></p>
	  </div>
	</div>
  );
}

export default SetPal;