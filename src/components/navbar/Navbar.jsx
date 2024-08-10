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
      <div className={styles.social}>
        <Image src="/facebook.png" alt="facebook" width={24} height={24} />
        <Image src="/instagram.png" alt="instagram" width={24} height={24} />
        <Image src="/tiktok.png" alt="tiktok" width={24} height={24} />
        <Image src="/youtube.png" alt="youtube" width={24} height={24} />
      </div>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/images/noobshroom-full-logo.png"
            alt="nooshroom logo"
            width={200}
            height={46}
          />
        </Link>
      </div>

      <ul className={styles.navMenu}>
        <div className={styles.links}>
          <ThemeToggle />
        </div>
        <NavItem label="Categories">
          <DropdownMenu>
            <DropdownItem
              label="Web Development"
              link="/services/web-development"
            />
            <DropdownItem
              label="App Development"
              link="/services/app-development"
            />
            <DropdownItem label="SEO Services" link="/services/seo" />
          </DropdownMenu>
        </NavItem>
        <NavItem label="About" link="/about" />
        <NavItem label="Contact" link="/contact" />
        <NavItem label="Blog">
          <DropdownMenu>
            <AuthLinks />
          </DropdownMenu>
        </NavItem>
      </ul>
    </div>
  );
};

export default Navbar;
