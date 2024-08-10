import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";
import NavItem from "../navItem/navItem"; // Import the NavItem component
import DropdownMenu from "../dropdownMenu/dropdownMenu"; // Import the DropdownMenu component
import DropdownItem from "../dropdownItem/dropdownItem"; // Import the DropdownItem component

const Navbar = () => {
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
            <span className={styles.discordText}>Community</span>
          </div>
        </div>
      </div>
      <div className={styles.logo}>
        <Link href="/">NoobShroom</Link>
      </div>

      <ul className={styles.navMenu}>
        {/* <div className={styles.links}>
          <ThemeToggle />
        </div> */}
        {/* <NavItem label="Categories">
          <DropdownMenu>
            <DropdownItem
              label="Web Development"
              link="/services/web-development"
            />
            <DropdownItem label="SEO Services" link="/services/seo" />
          </DropdownMenu>
        </NavItem> */}
        <NavItem label="About" link="/posts/about-us" />
        <NavItem label="Contact" link="/posts/contact-us" />
        <AuthLinks />
      </ul>
    </div>
  );
};

export default Navbar;
