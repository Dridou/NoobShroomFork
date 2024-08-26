"use client";

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

  return (
    <div className={styles.container}>
      <div className={styles.discord}>
        <Link
          href="https://discord.gg/V8FzGSQyer"
          target="_blank"
          className={styles.discordButton}
        >
          <Image
            src="/images/icon_discord.png"
            alt="Discord Logo"
            width={30}
            height={23}
            className={styles.discordLogo}
          />
          <span className={styles.discordText}>Community</span>
        </Link>

        <Link
          href="https://www.buymeacoffee.com/NoobShroom"
          target="_blank"
          className={styles.bmcButton}
        >
          <Image
            src="/images/bmc-logo.png"
            alt="Buy me a coffee Logo"
            width={32}
            height={32}
            className={styles.discordLogo}
          />
          <span className={styles.bmcText}>Buy me a coffee</span>
        </Link>
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
	  	<NavItem label="Updates" link="/posts/updates" />
        <NavItem label="About" link="/posts/about-us" />
        <NavItem label="Contact" link="/posts/contact-us" />
        <AuthLinks />
      </ul>
    </div>
  );
};

export default Navbar;
