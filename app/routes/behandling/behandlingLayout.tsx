import React, { useState, useCallback, useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { BehandlingContext, type ÅrsakState } from "~/contexts/BehandlingContext";
import {
  BehandlingFaner,
  type BehandlingSteg,
  type Steg,
} from "~/komponenter/navbar/BehandlingFaner";
import { Side } from "~/komponenter/layout/Side";
import { apiCall, type ApiResponse } from "~/api/backend";
import type { ÅrsakBehandlingResponse } from "~/hooks/useÅrsakBehandling";
import type { VilkårVurderingResponse } from "~/hooks/useVilkårVurdering";

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

  const markerStegSomFerdig = useCallback((steg: Steg) => {
    settFerdigeSteg((prev) => (prev.includes(steg) ? prev : [...prev, steg]));
  }, []);

  const oppdaterÅrsakState = useCallback((data: Partial<ÅrsakState>) => {
    settÅrsakState((prev) => ({ ...prev, ...data }) as ÅrsakState);
  }, []);

  useEffect(() => {
    if (!behandlingId || årsakDataHentet) return;

    const hentData = async () => {
      try {
        const årsakResponse: ApiResponse<ÅrsakBehandlingResponse> = await apiCall(
          `/arsak/${behandlingId}`
        );

        const vilkårResponse: ApiResponse<VilkårVurderingResponse[]> = await apiCall(
          `/vilkar/${behandlingId}`
        );

        const initialFerdigeSteg: Steg[] = [];

        if (årsakResponse.data) {
          const data = årsakResponse.data;
          settÅrsakState({
            kravdato: new Date(data.kravdato),
            årsak: data.årsak || "",
            beskrivelse: data.beskrivelse,
          });

          const erÅrsakFerdig = data.kravdato && data.årsak;
          if (erÅrsakFerdig) {
            initialFerdigeSteg.push("Årsak behandling");
          }
        }

        if (vilkårResponse.data && vilkårResponse.data.length === 5) {
          const alleVilkårFerdige = vilkårResponse.data.every(
            (v) => v.vurdering && v.begrunnelse && v.begrunnelse.trim() !== ""
          );
          if (alleVilkårFerdige) {
            initialFerdigeSteg.push("Vilkår");
          }
        }

        settFerdigeSteg(initialFerdigeSteg);
        settÅrsakDataHentet(true);
      } catch (error) {
        console.error("Kunne ikke hente behandlingsdata:", error);
        settÅrsakDataHentet(true);
      }
    };

    hentData();
  }, [behandlingId, årsakDataHentet]);

  const hentÅrsakData = useCallback(async () => {
    if (!behandlingId) return;

    try {
      const response: ApiResponse<ÅrsakBehandlingResponse> = await apiCall(
        `/arsak/${behandlingId}`
      );

      if (response.data) {
        settÅrsakState({
          kravdato: new Date(response.data.kravdato),
          årsak: response.data.årsak || "",
          beskrivelse: response.data.beskrivelse,
        });
      }
    } catch (error) {
      console.error("Kunne ikke hente årsak data:", error);
    }
  }, [behandlingId]);

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
