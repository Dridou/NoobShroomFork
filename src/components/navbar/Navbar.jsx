"use client";

import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext"; // Chemin du fichier ThemeProvider
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import NavItem from "../navItem/NavItem";

const Navbar = () => {

  const { isMobileMenuOpen, toggleMobileMenu } = useContext(ThemeContext); // Utilise le contexte pour le menu mobile

  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <Image
          src="/images/noobshroom-full-logo.png"
          alt="Noobshroom complete Logo"
          width={200}
          height={48}
        />
      </div>

      {/* Menu de navigation */}
      <ul className={isMobileMenuOpen ? styles.navMenuOpen : styles.navMenu}>
        <a href="/">Home</a>

        <NavItem label="News">
          <Link href="/posts/legend-of-mushrooms-codes">Codes</Link>
          <Link href="/posts/update-new-class">Update new class</Link>
		  <Link href="/posts/update-sea-12-september">Update SEA 12.09</Link>
          {/* <Link href={postUrl + "codes"}>Leaks</Link> */}
          {/* <Link href={postUrl + "codes"}>Dev Announcement</Link> */}
        </NavItem>

        <NavItem label="Class Guides">
          <Link href="/posts/best-class">Best class</Link>
          <Link href="/posts/arrowgod-class-guide">Archer - Plume Monarch</Link>
          <Link href="/posts/berseker-class-guide">Warrior - Berserker</Link>
          <Link href="/posts/prophet-preblitz-class-guide">Mage - Prophet Pre-blitz</Link>
          {/* <Link href="/posts/spirit-channeler">Spirit Channeler</Link> */}
        </NavItem>

        <NavItem label="Mechanics">
          <Link href="/posts/artifact-runes">Artifact Runes</Link>
          <Link href="/posts/character-attributes">Character stats</Link>
          <Link href="/posts/gear-plans">Gear Plans</Link>
          <Link href="/posts/battle-plans">Battle Plans</Link>
        </NavItem>

        {/* <NavItem label="Pve - Dungeons">
          <Link href={postUrl + "codes"}>Cross the Abyssal Portal</Link>
          <Link href={postUrl + "codes"}>Molten Ruins</Link>
          <Link href={postUrl + "codes"}>Flame Temple</Link>
        </NavItem> */}

        <NavItem label="PvP-Modes">
          <Link href="/posts/cross-server-arena">Cross-Server Arena</Link>
          <Link href="/posts/cross-server-showdown">Cross-Server Showdown</Link>
          <Link href="/posts/parking-wars">Parking Wars</Link>
        </NavItem>

        <NavItem label="Resources">
          <Link href="/posts/what-to-buy-in-shops">Shops</Link>
          <Link href="/posts/spending-red-gems">Spending Red Gems</Link>
          <Link href="/posts/most-profitable-packs">Best Packs</Link>
          <Link href="/posts/mining">Mining</Link>
          <Link href="/posts/prayer-statue">Prayer Statue</Link>
        </NavItem>

        <NavItem label="About" className={styles.navItem}>
          <Link href="/posts/updates">Noobshroom Updates</Link>
          <Link href="/posts/about-us">About Us</Link>
          <Link href="/posts/contact-us">Contact Us</Link>
          <Link href="/posts/privacy-policy">Privacy Policy</Link>
          <Link href="/posts/terms">Terms of Use</Link>
          <Link href="/posts/source-credit">Source Credit</Link>
        </NavItem>

        <AuthLinks />
      </ul>

      <div className={styles.discord}>
        <Link
          href="https://discord.gg/V8FzGSQyer"
          className={styles.discordButton}
        >
          <Image
            src="/images/icon_discord.png"
            alt="Discord Logo"
            width={30}
            height={23}
          />
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
          />
        </Link>
      </div>
      {/* Menu hamburger pour mobile */}
      <div className={styles.hamburger} onClick={toggleMobileMenu}>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </div>

      {/* Boutons de Discord et Buy Me a Coffee */}
    </nav>
  );
};

export default Navbar;
