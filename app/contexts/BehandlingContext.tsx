import React, { useContext } from "react";
// import type { Behandling } from "~/types/behandling";

export const BehandlingContext = React.createContext<{
  behandlingId: string;
  //   behandling?: Behandling;
}>({
  behandlingId: "",
  //   behandling: undefined,
});

export function useBehandlingContext() {
  const context = useContext(BehandlingContext);
  if (!context) {
    throw new Error("useBehandlingContext må brukes innenfor BehandlingProvider");
  }
  return context;
}
