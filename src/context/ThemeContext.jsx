"use client";

import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const getFromLocalStorage = () => {
  return "dark";
};

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return getFromLocalStorage();
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Nouvel état pour le menu mobile

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Bascule l'état du menu mobile
  };

  const toggle = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggle, isMobileMenuOpen,
        toggleMobileMenu}}>
      {children}
    </ThemeContext.Provider>
  );
};
