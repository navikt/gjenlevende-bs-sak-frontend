import { Box, Button, Loader, Table, VStack } from "@navikt/ds-react";
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
  perioder: SimuleringPeriode[];
}

interface SimuleringPeriode {
  fom: string;
  tom: string;
  utbetalinger: SimuleringUtbetaling[];
}

interface SimuleringUtbetaling {
  fagsystem: string;
  sakId: string;
  utbetalesTil: number;
  stønadstype: string;
  tidligereUtbetalt: number;
  nyttBeløp: number;
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
        {simuleringResultat ? (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                {simuleringResultat.perioder.map((periode) => (
                  <Table.HeaderCell key={periode.fom}>{periode.fom}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.HeaderCell>Tidligere utbetalt</Table.HeaderCell>
                {simuleringResultat.perioder.map((periode) => (
                  <Table.DataCell key={periode.fom}>
                    {periode.utbetalinger.reduce((sum, u) => sum + u.tidligereUtbetalt, 0)}
                  </Table.DataCell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Nytt beløp</Table.HeaderCell>
                {simuleringResultat.perioder.map((periode) => (
                  <Table.DataCell key={periode.fom}>
                    {periode.utbetalinger.reduce((sum, u) => sum + u.nyttBeløp, 0)}
                  </Table.DataCell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Differanse</Table.HeaderCell>
                {simuleringResultat.perioder.map((periode) => {
                  const tidligereUtbetalt = periode.utbetalinger.reduce((sum, u) => sum + u.tidligereUtbetalt, 0);
                  const nyttBeløp = periode.utbetalinger.reduce((sum, u) => sum + u.nyttBeløp, 0);
                  const differanse = nyttBeløp - tidligereUtbetalt;
                  return (
                    <Table.DataCell key={periode.fom}>
                      {differanse !== 0 && (
                        <span style={{ color: differanse > 0 ? "var(--a-green-600)" : "var(--a-red-500)" }}>
                          {differanse}
                        </span>
                      )}
                    </Table.DataCell>
                  );
                })}
              </Table.Row>
            </Table.Body>
          </Table>
        ) : (
          <p>{statusMelding}</p>
        )}
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
