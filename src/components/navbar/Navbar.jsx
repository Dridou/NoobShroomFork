'use client'

import React, { useState } from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";
import NavItem from "../navItem/navItem";
import DropdownMenu from "../dropdownMenu/dropdownMenu";
import DropdownItem from "../dropdownItem/dropdownItem";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js";
    script.setAttribute("data-name", "bmc-button");
    script.setAttribute("data-slug", "NoobShroom");
    script.setAttribute("data-color", "#5F7FFF");
    script.setAttribute("data-emoji", "🍄");
    script.setAttribute("data-font", "Comic");
    script.setAttribute("data-text", "Buy me a mushroom");
    script.setAttribute("data-outline-color", "#000000");
    script.setAttribute("data-font-color", "#ffffff");
    script.setAttribute("data-coffee-color", "#FFDD00");
    script.async = true;

    document.getElementById("buyMeACoffeeContainer").appendChild(script);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.discord}>
        <div className={styles.discordContainer}>
          <div className={styles.discordButton}>
            <Image
              src="/images/icon_discord.png"
              alt="Discord Logo"
              width={30}
              height={23}
              className={styles.discordLogo}
            />
            <Link href="https://discord.gg/BtwdhuBk" target="_blank" className={styles.discordText}>Community</Link>
          </div>
        </div>
		<div id="buyMeACoffeeContainer"></div>
      </div>
      <div className={styles.logo}>
        <Link href="/">NoobShroom</Link>
      </div>

      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </div>


      <ul className={`${styles.navMenu} ${isOpen ? styles.navMenuOpen : ""}`}>
        <NavItem label="About" link="/posts/about-us" />
        <NavItem label="Contact" link="/posts/contact-us" />
        <AuthLinks />
      </ul>
    </div>
  );
};

export default Navbar;
