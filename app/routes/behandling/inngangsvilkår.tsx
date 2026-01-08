import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Heading, VStack } from "@navikt/ds-react";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useBehandlingSteg } from "~/hooks/useBehandlingSteg";
import { useMarkerStegFerdige } from "~/hooks/useMarkerStegFerdige";
import type { Route } from "./+types/inngangsvilkår";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Inngangsvilkår" }];
}

export default function Inngangsvilkår() {
  const { behandlingId } = useBehandlingContext();
  const [erUtfylt, settErUtfylt] = useState(false);
  const navigate = useNavigate();
  const { finnNesteSteg } = useBehandlingSteg();

  useMarkerStegFerdige("inngangsvilkår", erUtfylt);
  const harFyltUtAlt = true; // TODO: Implementere validering

  const navigerTilNeste = () => {
    const nesteSteg = finnNesteSteg("inngangsvilkar");
    if (nesteSteg) {
      navigate(`../${nesteSteg.path}`, { relative: "path" });
    }
  };

  const handleNesteKlikk = () => {
    if (harFyltUtAlt) {
      settErUtfylt(true);
      navigerTilNeste();
    }
  };

  return (
    <VStack gap="4">
      <Heading size="large">Inngangsvilkår</Heading>
      <p>Behandling ID: {behandlingId}</p>

      <div>
        <Button onClick={handleNesteKlikk} disabled={!harFyltUtAlt}>
          Neste
        </Button>
      </div>
    </VStack>
  );
}
