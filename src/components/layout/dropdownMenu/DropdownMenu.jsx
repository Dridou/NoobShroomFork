import React from 'react';
import styles from "./DropdownMenu.module.css";

const DropdownMenu = ({ children }) => {
  return <ul className={styles.dropdownMenu}>{children}</ul>;
};

export default DropdownMenu;
