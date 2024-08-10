'use client'

import React, { useState } from 'react';
import styles from './navItem.module.css';

const NavItem = ({ label, link, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <li
      className={styles.navItem}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {link ? (
        <a href={link} className={styles.navLink}>
          {label}
        </a>
      ) : (
        <span className={styles.navLink}>{label}</span>
      )}
      {open && children}
    </li>
  );
};

export default NavItem;