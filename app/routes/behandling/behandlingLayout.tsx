import React, { useState, useCallback } from "react";
import { Outlet, useParams } from "react-router";
import { BehandlingContext, type ÅrsakState } from "~/contexts/BehandlingContext";
import {
  BehandlingFaner,
  type BehandlingSteg,
  type Steg,
} from "~/komponenter/navbar/BehandlingFaner";
import { Side } from "~/komponenter/layout/Side";
import { hentÅrsakBehandling } from "~/api/backend";

const BEHANDLING_STEG_LISTE: BehandlingSteg[] = [
  {
    path: "arsak-behandling",
    navn: "Årsak behandling",
    kanStarte: () => true,
  },
  {
    path: "vilkar",
    navn: "Vilkår",
    kanStarte: (ferdigeSteg) => ferdigeSteg.includes("Årsak behandling"),
  },
  {
    path: "vedtak-og-beregning",
    navn: "Vedtak og beregning",
    kanStarte: (ferdigeSteg) => ferdigeSteg.includes("Vilkår"),
  },
  {
    path: "brev",
    navn: "Brev",
  },
];

export default function BehandlingLayout() {
  const { behandlingId } = useParams<{ behandlingId: string }>();
  const [ferdigeSteg, settFerdigeSteg] = useState<Steg[]>([]);
  const [årsakState, settÅrsakState] = useState<ÅrsakState | undefined>(undefined);
  const [årsakDataHentet, settÅrsakDataHentet] = useState(false);
  //   const { behandling } = useHentBehandling(behandlingId);

  const markerStegSomFerdig = (steg: Steg) => {
    settFerdigeSteg((prev) => (prev.includes(steg) ? prev : [...prev, steg]));
  };

  const oppdaterÅrsakState = useCallback((data: Partial<ÅrsakState>) => {
    settÅrsakState((prev) => ({ ...prev, ...data }) as ÅrsakState);
  }, []);

  const hentÅrsakData = useCallback(async () => {
    if (årsakDataHentet || !behandlingId) return;

    try {
      const response = await hentÅrsakBehandling(behandlingId);
      if (response.data) {
        settÅrsakState({
          kravdato: new Date(response.data.kravdato),
          årsak: response.data.årsak || "",
          beskrivelse: response.data.beskrivelse,
        });
        settÅrsakDataHentet(true);
      }
    } catch (error) {
      console.error("Kunne ikke hente årsak data:", error);
    }
  }, [behandlingId, årsakDataHentet]);

  if (!behandlingId) {
    return <div>Mangler behandling id</div>;
  }

  return (
    <BehandlingContext.Provider
      value={{
        behandlingId,
        ferdigeSteg,
        markerStegSomFerdig,
        stegListe: BEHANDLING_STEG_LISTE,
        årsakState,
        oppdaterÅrsakState,
        hentÅrsakData,
        årsakDataHentet,
      }}
    >
      <BehandlingFaner steg={BEHANDLING_STEG_LISTE} ferdigeSteg={ferdigeSteg} />
      <Side>
        <Outlet />
      </Side>
    </BehandlingContext.Provider>
  );
}
