import { Box, Button, Loader, VStack } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
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
  const [statusMelding, settStatusMelding] = useState<string>("");
  const [laster, settLaster] = useState(true);

  const handleHentResultat = async () => {
    const resultat = await hentSimulertResultat(behandlingId);
    if (resultat.data) {
      settSimuleringResultat(resultat.data);
      settStatusMelding("Simulering fullført");
      settLaster(false);
      return true;
    }
    return false;
  };

  useEffect(() => {
    let avbrutt = false;

    const hentVedInnlasting = async () => {
      const fantSimuleringResultat = await handleHentResultat();
      if (fantSimuleringResultat || avbrutt) return;

      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (!avbrutt) {
        settLaster(false);
        settStatusMelding("Simulering er ikke ferdig. Prøv igjen om litt");
      }
    };

    hentVedInnlasting();
    return () => {
      avbrutt = true;
    };
  }, [behandlingId]);

  const handleSimulering = async () => {
    const respons = await simuler(behandlingId);
    if (respons.data) {
      settStatusMelding(respons.data);
    }
  };

  if (laster) {
    return <Loader size="medium" title="Henter simuleringsresultat..." />;
  }

  return (
    <VStack align={"center"}>
      {/*TODO Fjerne Øverste knappen. Skal skje etter "beregn" i forrige steg */}
      <Box>
        <Button onClick={handleSimulering}>Simuler</Button>
        {!simuleringResultat && (
          <Button variant="secondary" onClick={handleHentResultat}>
            Hent simuleringsresultat
          </Button>
        )}
        <p>{simuleringResultat ? simuleringResultat.status.toString() : statusMelding}</p>
      </Box>
      {harForrigeSteg && (
        <Box>
          <Button variant="secondary" onClick={navigerTilForrige}>
            Tilbake
          </Button>
        </Box>
      )}
    </VStack>
  );
}
