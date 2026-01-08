import React, { useContext } from "react";
import type { BehandlingSteg, Steg } from "~/komponenter/navbar/BehandlingFaner";
// import type { Behandling } from "~/types/behandling";

export const BehandlingContext = React.createContext<{
  behandlingId: string;
  ferdigeSteg: Steg[];
  markerStegSomFerdig: (steg: Steg) => void;
  stegListe?: BehandlingSteg[];
  //   behandling?: Behandling;
}>({
  behandlingId: "",
  ferdigeSteg: [],
  markerStegSomFerdig: () => {},
  stegListe: undefined,
  //   behandling: undefined,
});

export function useBehandlingContext() {
  const context = useContext(BehandlingContext);
  if (!context) {
    throw new Error("useBehandlingContext må brukes innenfor BehandlingProvider");
  }
  return context;
}
