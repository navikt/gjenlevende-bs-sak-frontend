import { HStack, Link } from "@navikt/ds-react";
import { NavLink } from "react-router";
import styles from "./Navbar.module.css";

export const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <HStack className={styles.navLinks}>
        <NavLink
          to="/vedtaksperioderInfotrygd"
          className={({ isActive }) =>
            `${styles.link}${isActive ? ` ${styles.active}` : ""}`
          }
        >
          Vedtaksperioder Infotrygd
        </NavLink>
      </HStack>
    </nav>
  );
};

export default Navbar;
