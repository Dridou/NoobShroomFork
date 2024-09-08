import React, { useState, useContext } from 'react';
import styles from './navItem.module.css';
import { ThemeContext } from '@/context/ThemeContext';  // Assurez-vous d'importer le bon contexte

const NavItem = ({ label, link, children }) => {
  const [isOpen, setIsOpen] = useState(false);  // Etat local pour gérer l'ouverture/fermeture du sous-menu
  const [isClicked, setIsClicked] = useState(false);

  const { isMobileMenuOpen, toggleMobileMenu } = useContext(ThemeContext);  // Utilisation du contexte pour gérer le menu mobile

  const toggleDropdown = () => {
    if (!isClicked) {
      setIsOpen(true);
    }
  };

  const closeDropdown = () => {
    if (!isClicked) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setIsOpen(false);  // Ferme le sous-menu après le clic

    if (isMobileMenuOpen) {
      toggleMobileMenu();  // Ferme aussi le menu mobile
    }
  };

  const handleMouseLeave = () => {
    setIsClicked(false);
    setIsOpen(false);  // Ferme le sous-menu au hover si pas cliqué
  };

  return (
    <li
      className={`${styles.navItem}`}
      onMouseEnter={toggleDropdown}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.navLink}>
        {label}
      </span>

      {/* Si `isOpen` est vrai, on affiche le sous-menu avec une animation */}
      <ul className={` ${isOpen ? styles.open : ''} ${styles.dropdownMenu}`}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            onClick: handleClick,  // Ferme le menu après un clic sur l'élément enfant
          })
        )}
      </ul>
    </li>
  );
};

export default NavItem;
