import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button, VStack } from "@navikt/ds-react";
import { useBehandlingSteg } from "~/hooks/useBehandlingSteg";
import { useMarkerStegFerdige } from "~/hooks/useMarkerStegFerdige";
import { VilkårInnhold } from "~/komponenter/behandling/vilkår/VilkårInnhold";
import type { Route } from "./+types/vilkår";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Vilkår" }];
}

export default function Vilkår() {
  // const { behandlingId } = useBehandlingContext();
  const [erVilkårUtfylt, settErVilkårUtfylt] = useState<boolean>(false);
  const navigate = useNavigate();
  const { finnNesteSteg } = useBehandlingSteg();

  useMarkerStegFerdige("Vilkår", erVilkårUtfylt === true);
  const harFyltUtAlt = erVilkårUtfylt;

  const navigerTilNeste = () => {
    const nesteSteg = finnNesteSteg("vilkar");
    if (nesteSteg) {
      navigate(`../${nesteSteg.path}`, { relative: "path" });
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

      <div>
        <Button onClick={handleNesteKlikk} disabled={!harFyltUtAlt}>
          Neste
        </Button>
      </div>
    </VStack>
  );
}
