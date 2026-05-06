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

const simuler = async (behandlingId: string, body?: unknown): Promise<ApiResponse<string>> => {
  return await apiCall(`/simulering/${behandlingId}`, {
    method: "GET",
    // body: body ? JSON.stringify(body) : undefined,
  });
};

export default function Simulering() {
  const { behandlingId } = useBehandlingContext();
  const { navigerTilForrige, harForrigeSteg } = useStegNavigering(STEG_PATH);
  const [simuleringResultat, settSimuleringResultat] = useState<string>("Ikke mottatt noe");

  const handleSimulering = async () => {
    const respons = await simuler(behandlingId);
    if (respons.data) {
      settSimuleringResultat(respons.data);
    }
  };

  return (
    <HStack>
      <Button onClick={handleSimulering}>Simuler</Button>
      <p>{simuleringResultat}</p>
    </HStack>
  );
}
