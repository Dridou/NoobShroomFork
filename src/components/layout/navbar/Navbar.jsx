"use client";

import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";

const MENU_GROUPS = [
  {
    title: "Start Here",
    links: [
      { href: "/posts/best-class", label: "Best class" },
      { href: "/posts/legend-of-mushrooms-codes", label: "Codes" },
      { href: "/posts/talent-generator", label: "Talent simulator" },
    ],
  },
  {
    title: "Class Guides",
    links: [
      { href: "/posts/arrowgod-class-guide", label: "Archer - Plume Monarch" },
      { href: "/posts/berseker-class-guide", label: "Warrior - Berserker" },
      { href: "/posts/prophet-preblitz-class-guide", label: "Mage - Prophet Pre-blitz" },
      { href: "/posts/mage-prophet-tank-regen", label: "Mage - Prophet Regen" },
      { href: "/posts/beast-master-class-guide", label: "Spirit Channeler - Beast Master" },
    ],
  },
  {
    title: "Mechanics",
    links: [
      { href: "/posts/character-attributes", label: "Character stats" },
      { href: "/posts/artifact-runes", label: "Artifact Runes" },
      { href: "/posts/battle-plans", label: "Battle & Gear Plans" },
    ],
  },
  {
    title: "PvE",
    links: [
      { href: "/posts/dungeon-assault-lamp-thief", label: "Lamp Thief Dungeon" },
      { href: "/posts/dungeon-molten-ruins", label: "Molten Ruins" },
    ],
  },
  {
    title: "PvP",
    links: [
      { href: "/posts/cross-server-arena", label: "Cross-Server Arena" },
      { href: "/posts/cross-server-showdown", label: "Cross-Server Showdown" },
      { href: "/posts/parking-wars", label: "Parking Wars" },
    ],
  },
  {
    title: "Economy",
    links: [
      { href: "/posts/what-to-buy-in-shops", label: "Shops" },
      { href: "/posts/most-profitable-packs", label: "Best Packs" },
      { href: "/posts/spending-red-gems", label: "Spending Red Gems" },
      { href: "/posts/mining", label: "Mining" },
      { href: "/posts/prayer-statue", label: "Prayer Statue" },
    ],
  },
  {
    title: "News",
    links: [
      { href: "/posts/updates", label: "Noobshroom Updates" },
      { href: "/posts/update-new-class", label: "Update new class" },
      { href: "/posts/update-sea-12-september", label: "Update SEA 12.09" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/posts/about-us", label: "About Us" },
      { href: "/posts/contact-us", label: "Contact Us" },
      { href: "/posts/privacy-policy", label: "Privacy Policy" },
      { href: "/posts/terms", label: "Terms of Use" },
      { href: "/posts/source-credit", label: "Source Credit" },
    ],
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/images/noobshroom-full-logo.png"
            alt="Noobshroom complete Logo"
            width={200}
            height={48}
            layout="responsive"
            className={styles.fulllogo}
          />
          <Image
            src="/images/noobshroom-logo-icon.png"
            alt="Noobshroom Icon"
            width={653}
            height={614}
            layout="responsive"
            className={styles.iconlogo}
          />
        </Link>
      </div>

      <div className={styles.primaryNav}>
        <Link href="/" className={styles.home}>
          Home
        </Link>
        <button
          type="button"
          className={styles.megaToggle}
          aria-expanded={isMenuOpen}
          aria-controls="mega-menu-panel"
          onClick={toggleMenu}
        >
          Explore
        </button>
        <Link href="/posts/updates" className={styles.primaryLink}>
          News
        </Link>
        <Link href="/posts/about-us" className={styles.primaryLink}>
          About
        </Link>
      </div>

      <div className={styles.authDesktop}>
        <AuthLinks />
      </div>

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

      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </div>

      {isMenuOpen && (
        <div className={styles.megaOverlay} onClick={closeMenu}>
          <div
            className={styles.megaPanel}
            role="dialog"
            aria-modal="true"
            id="mega-menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.megaHeader}>
              <div className={styles.megaTitle}>Browse NoobShroom</div>
              <button
                type="button"
                className={styles.megaClose}
                onClick={closeMenu}
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
            <div className={styles.megaGrid}>
              {MENU_GROUPS.map((group) => (
                <div className={styles.megaGroup} key={group.title}>
                  <div className={styles.megaGroupTitle}>{group.title}</div>
                  <ul className={styles.megaList}>
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={styles.megaLink}
                          onClick={closeMenu}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className={styles.megaAuth}>
              <AuthLinks />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
