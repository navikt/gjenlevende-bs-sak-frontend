import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@navikt/ds-react";
import { useBehandlingSteg } from "~/hooks/useBehandlingSteg";
import { useMarkerStegFerdige } from "~/hooks/useMarkerStegFerdige";
import { VilkårInnhold } from "~/komponenter/behandling/vilkår/VilkårInnhold";
import type { Route } from "./+types/vilkår";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Vilkår" }];
}

// TODO: Rename til Vilkår?
export default function Vilkår() {
  // const { behandlingId } = useBehandlingContext();
  const [erVilkårUtfylt, settErVilkårUtfylt] = useState(false);
  const navigate = useNavigate();
  const { finnNesteSteg } = useBehandlingSteg();

  useMarkerStegFerdige("vilkår", erVilkårUtfylt);
  const harFyltUtAlt = erVilkårUtfylt;

  const navigerTilNeste = () => {
    const nesteSteg = finnNesteSteg("vilkår");
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
    <>
      <VilkårInnhold settErVilkårUtfylt={settErVilkårUtfylt} />

      <div>
        <Button onClick={handleNesteKlikk} disabled={!harFyltUtAlt}>
          Neste
        </Button>
      </div>
    </>
  );
}
