import { Button, HStack } from "@navikt/ds-react";
import React, { useState } from "react";
import type { Route } from "./+types/simulering";
import type { StegPath } from "~/komponenter/navbar/BehandlingFaner";
import { useStegNavigering } from "~/hooks/useStegNavigering";
import { apiCall, type ApiResponse } from "~/api/backend";
import { useBehandlingContext } from "~/contexts/BehandlingContext";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Simulering" },
    {
      name: "Simulering",
      content: "Simuleringsside",
    },
  ];
}

const STEG_PATH: StegPath = "simulering";

export interface SimuleringResultat {
  status: string;
  fom: Date;
  tom: Date;
  utbetalinger: Utbetaling[];
}

interface Utbetaling {
  fagsystem: string;
  sakId: string;
  utbetalesTil: number;
  stønadstype: string;
  tidligereUtbetalt: number;
  beløp: number;
}

const simuler = async (behandlingId: string): Promise<ApiResponse<string>> => {
  return await apiCall(`/simulering/${behandlingId}`, {
    method: "GET",
  });
};

const hentSimulertResultat = async (
  behandlingId: string
): Promise<ApiResponse<SimuleringResultat>> => {
  return await apiCall(`/simulering/${behandlingId}/resultat`, {
    method: "GET",
  });
};

export default function Simulering() {
  const { behandlingId } = useBehandlingContext();
  const { navigerTilForrige, harForrigeSteg } = useStegNavigering(STEG_PATH);
  const [simuleringResultat, settSimuleringResultat] = useState<SimuleringResultat | null>(null);
  const [statusMelding, settStatusMelding] = useState<string>("Ikke mottatt noe");

  const handleSimulering = async () => {
    const respons = await simuler(behandlingId);
    if (respons.data) {
      settStatusMelding(respons.data);
    }
  };

  const handleHentResultat = async () => {
    const resultat = await hentSimulertResultat(behandlingId);
    if (resultat.data) {
      settSimuleringResultat(resultat.data);
      settStatusMelding("Simulering fullført");
    } else {
      settStatusMelding("Simulering er ikke ferdig. Prøv igjen om litt");
    }
  };

  return (
    <HStack>
      <Button onClick={handleSimulering}>Simuler</Button>
      <Button variant="secondary" onClick={handleHentResultat}>
        Hent simuleringsresultat
      </Button>
      <p>{simuleringResultat ? simuleringResultat.status.toString() : statusMelding}</p>
      {harForrigeSteg && (
        <Button variant="secondary" onClick={navigerTilForrige}>
          Tilbake
        </Button>
      )}
    </HStack>
  );
}
