import React from "react";
import styles from "./SetSectionList.module.css";

const SetSectionList = ({ list, title }) => {
	return (
		<div className={styles.container}>
		  <h4 className={styles.title}>{title}</h4>
		  <div className={styles.mountsList}>
			<ul>
			  {list.map((item, index) => (
				<li key={index} className={styles.mountItem}>
				  <strong>{item.name}</strong>: {item.description}
				</li>
			  ))}
			</ul>
		  </div>
		</div>
	  );
	};

export default SetSectionList;
