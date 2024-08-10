"use client";
import Link from "next/link";
import Image from "next/image";
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
        <div className={styles.loggedIn}>
			<span className={styles.navLink} onClick={() => signOut()}>
            Logout
          </span>
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="User Image"
              width={30} // Vous pouvez ajuster la largeur selon vos besoins
              height={30} // Vous pouvez ajuster la hauteur selon vos besoins
              className={styles.userImage} // Ajoutez un style si nécessaire
            />
          )}

        </div>
      )}
    </li>
  );
};

export default AuthLinks;