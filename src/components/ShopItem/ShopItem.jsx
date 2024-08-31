// components/ShopItem.jsx

import React from "react";
import "../../app/styles/colStyles.css"; // Import custom table styles
import "../../app/styles/tableStyles.css"; // Import custom table styles
import styles from "./ShopItem.module.css";
import Image from "next/image";

const ShopItem = ({
  objectImage,
  objectName,
  price,
  priority,
  explanation,
  money,
  secondMoney,
}) => {
  // Déterminer la classe CSS à appliquer en fonction de la valeur de `priority`

  const moneyToUse = () => {
    const crystalItems = [
      "Chrono key x1",
      "Guardian Key x1",
      "Empowerement gear x1",
      "Hundred Slashes Skill",
      "Windborne Arrow Skill",
      "Random Red soul 1",
      "Crimson Moonfall Skill",
      "Hundred Slashes Shard",
      "Windborne Arrow Shard",
      "Crimson Moonfall Shard",
      "Hammer x300",
    ];
    if (secondMoney && !crystalItems.includes(objectName)) {
      return secondMoney;
    } else {
      return money;
    }
  };

  const getPriorityClass = () => {
    if (priority.includes("never")) {
      return styles.never;
    } else if (priority.includes("rarely")) {
      return styles.rarely;
    } else if (priority.includes("optional")) {
      return styles.optional;
    } else if (priority.includes("situational")) {
      return styles.situational;
    } else if (priority.includes("important")) {
      return styles.important;
    } else if (priority.includes("mandatory")) {
      return styles.mandatory;
    } else if (priority.includes("always")) {
      return styles.always;
    } else {
      return ""; // Default class if no match found
    }
  };

  return (
    <tr>
      <td>
        <div className={styles.objetImageContainer}>
          <Image src={objectImage} alt={objectName} width={48} height={48} />
        </div>
        <div className={`${styles.priority} ${getPriorityClass()}`}>
          {priority}
        </div>
      </td>
      <td>
        <div className={styles.objetNameAndPrice}>{objectName}</div>
      </td>
      <td>
        <div className={styles.objetNameAndPrice}>
          {price}{" "}
          <Image
            src={`${moneyToUse()}`}
            width={28}
            height={28}
            alt="item money"
            className={styles.image}
          />
        </div>
      </td>
      <td dangerouslySetInnerHTML={{ __html: explanation }}></td>
    </tr>
  );
};

export default ShopItem;
