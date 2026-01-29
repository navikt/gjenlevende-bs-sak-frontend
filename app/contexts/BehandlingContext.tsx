import React, { useContext } from "react";
import type { BehandlingSteg, Steg } from "~/komponenter/navbar/BehandlingFaner";
import type { ÅrsakType } from "~/types/årsak";
// import type { Behandling } from "~/types/behandling";

export interface ÅrsakState {
  kravdato: Date;
  årsak: ÅrsakType | "";
  beskrivelse: string;
}

export const BehandlingContext = React.createContext<{
  behandlingId: string;
  ferdigeSteg: Steg[];
  markerStegSomFerdig: (steg: Steg) => void;
  stegListe?: BehandlingSteg[];
  //   behandling?: Behandling;
  årsakState?: ÅrsakState;
  oppdaterÅrsakState: (data: Partial<ÅrsakState>) => void;
  hentÅrsakData: () => Promise<void>;
  årsakDataHentet: boolean;
}>({
  behandlingId: "",
  ferdigeSteg: [],
  markerStegSomFerdig: () => {},
  stegListe: undefined,
  //   behandling: undefined,
  årsakState: undefined,
  oppdaterÅrsakState: () => {},
  hentÅrsakData: async () => {},
  årsakDataHentet: false,
});

export function useBehandlingContext() {
  const context = useContext(BehandlingContext);
  if (!context) {
    throw new Error("useBehandlingContext må brukes innenfor BehandlingProvider");
  }
  return context;
}
