import React from "react";
import { Tabs } from "@navikt/ds-react";
import { Endringshistorikk } from "~/komponenter/behandling/høyremeny/Endringshistorikk";
import styles from "./SidebarTabs.module.css";

export const SidebarTabs = () => {
  return (
    <Tabs defaultValue="historikk" size="small" className={styles.sidebarTabs}>
      <Tabs.List>
        <Tabs.Tab value="historikk" label="Historikk" />
        <Tabs.Tab value="dokumenter" label="Dokumenter" className={styles.disabledTab} />
      </Tabs.List>
      <Tabs.Panel value="historikk" className={styles.tabPanel}>
        <Endringshistorikk />
      </Tabs.Panel>
    </Tabs>
  );
};
