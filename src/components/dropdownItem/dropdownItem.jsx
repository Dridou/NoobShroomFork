import React from 'react';
import styles from './dropdownItem.module.css';

const DropdownItem = ({ label, link }) => {
  return (
    <li className={styles.dropdownItem}>
      <a href={link} className={styles.dropdownLink}>
        {label}
      </a>
    </li>
  );
};

export default DropdownItem;