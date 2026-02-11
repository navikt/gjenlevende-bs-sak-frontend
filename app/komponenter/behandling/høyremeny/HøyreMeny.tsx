import React from "react";
import styles from "./HøyreMeny.module.css";

export const HøyreMeny: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return <aside className={styles.høyreMeny}>{children}</aside>;
};
