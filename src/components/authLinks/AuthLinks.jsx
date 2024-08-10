"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { signOut, useSession } from "next-auth/react";

const AuthLinks = () => {
  const { data: session, status } = useSession();

  return (
    <li className={styles.auth}>
      {status === "unauthenticated" ? (
        <Link href="/login" className={styles.navLink}>
          Login
        </Link>
      ) : (
        <span className={styles.navLink} onClick={() => signOut()}>
          Logout
        </span>
      )}
    </li>
  );
};

export default AuthLinks;