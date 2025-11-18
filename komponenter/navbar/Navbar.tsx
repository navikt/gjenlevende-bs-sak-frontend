import React from "react";
import { HStack } from "@navikt/ds-react";
import { NavLink } from "react-router";
import styles from "./Navbar.module.css";

export const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <HStack className={styles.navLinks}>
        <NavLink
          to="vedtaksperioder"
          className={({ isActive }) =>
            `${styles.link}${isActive ? ` ${styles.active}` : ""}`
          }
        >
          Vedtaksperioder Infotrygd
        </NavLink>

        <NavLink
          to="brev"
          className={({ isActive }) =>
            `${styles.link}${isActive ? ` ${styles.active}` : ""}`
          }
        >
          Brev
        </NavLink>
      </HStack>
    </nav>
  );
};

export default Navbar;
