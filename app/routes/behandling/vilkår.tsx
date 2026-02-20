import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button, HStack, VStack } from "@navikt/ds-react";
import { useBehandlingSteg } from "~/hooks/useBehandlingSteg";
import { useMarkerStegFerdige } from "~/hooks/useMarkerStegFerdige";
import { VilkårInnhold } from "~/komponenter/behandling/vilkår/VilkårInnhold";
import type { Route } from "./+types/vilkår";
import type { StegPath } from "~/komponenter/navbar/BehandlingFaner";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Vilkår" }];
}

const STEG_PATH: StegPath = "vilkar";

export default function Vilkår() {
  const [erVilkårUtfylt, settErVilkårUtfylt] = useState<boolean>(false);
  const navigate = useNavigate();
  const { finnNesteSteg, finnForrigeSteg } = useBehandlingSteg();

  useMarkerStegFerdige("Vilkår", erVilkårUtfylt === true);
  const harFyltUtAlt = erVilkårUtfylt;

  const navigerTilNeste = () => {
    const nesteSteg = finnNesteSteg(STEG_PATH);
    if (nesteSteg) {
      navigate(`../${nesteSteg.path}`, { relative: "path" });
    }
  };

  const navigerTilForrige = () => {
    const forrigeSteg = finnForrigeSteg(STEG_PATH);
    if (forrigeSteg) {
      navigate(`../${forrigeSteg.path}`, { relative: "path" });
    }
  };

  const handleNesteKlikk = () => {
    if (harFyltUtAlt) {
      settErVilkårUtfylt(true);
      navigerTilNeste();
    }
  };

  return (
    <VStack gap={"space-24"}>
      <VilkårInnhold settErVilkårUtfylt={settErVilkårUtfylt} />

      <HStack justify="space-between">
        <Button variant="tertiary" onClick={navigerTilForrige}>
          Tilbake
        </Button>
        <Button onClick={handleNesteKlikk} disabled={!harFyltUtAlt}>
          Neste
        </Button>
      </HStack>
    </VStack>
  );
}
