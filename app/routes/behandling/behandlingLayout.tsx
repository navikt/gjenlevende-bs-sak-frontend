import React, { useState } from "react";
import { Outlet, useParams } from "react-router";
import { BehandlingContext } from "~/contexts/BehandlingContext";
import {
  BehandlingFaner,
  type BehandlingSteg,
  type Steg,
} from "~/komponenter/navbar/BehandlingFaner";
import { Side } from "~/komponenter/layout/Side";

const BEHANDLING_STEG_LISTE: BehandlingSteg[] = [
  {
    path: "vilkar",
    navn: "vilkår",
    kanStarte: () => true,
  },
  {
    path: "vedtak-og-beregning",
    navn: "vedtak og beregning",
    kanStarte: (ferdigeSteg) => ferdigeSteg.includes("vilkår"),
  },
  {
    path: "brev",
    navn: "Brev",
    kanStarte: (ferdigeSteg) => ferdigeSteg.includes("vilkår"),
  },
];

export default function BehandlingLayout() {
  const { behandlingId } = useParams<{ behandlingId: string }>();
  const [ferdigeSteg, settFerdigeSteg] = useState<Steg[]>([]);
  //   const { behandling } = useHentBehandling(behandlingId);

  if (!behandlingId) {
    return <div>Mangler behandling id</div>;
  }

  const markerStegSomFerdig = (steg: Steg) => {
    settFerdigeSteg((prev) => (prev.includes(steg) ? prev : [...prev, steg]));
  };

  return (
    <BehandlingContext.Provider
      value={{
        behandlingId,
        ferdigeSteg,
        markerStegSomFerdig,
        stegListe: BEHANDLING_STEG_LISTE,
      }}
    >
      <BehandlingFaner steg={BEHANDLING_STEG_LISTE} ferdigeSteg={ferdigeSteg} />
      <Side>
        <Outlet />
      </Side>
    </BehandlingContext.Provider>
  );
}
