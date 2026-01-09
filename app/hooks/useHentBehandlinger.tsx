import { useEffect, useState } from "react";
import { hentBehandlingerForFagsak } from "~/api/backend";
import type { Behandling } from "~/types/behandling";

interface BehandlingerState {
  behandlinger: [Behandling] | null;
  melding: string | null;
  laster: boolean;
}

export function useHentBehandlinger(fagsakId: string | undefined) {
  const [state, settState] = useState<BehandlingerState>({
    behandlinger: null,
    melding: null,
    laster: true,
  });

  useEffect(() => {
    const hentBehandlinger = async () => {
      if (!fagsakId) {
        settState((prev) => ({
          ...prev,
          melding: "Mangler fagsakId",
          laster: false,
        }));
        return;
      }

      settState((prev) => ({ ...prev, melding: null, laster: true }));

      try {
        const response = await hentBehandlingerForFagsak(fagsakId);

        if (response.data) {
          settState((prev) => ({
            ...prev,
            behandlinger: response.data ?? null,
            laster: false,
          }));
        }
      } catch (error) {
        console.error("Feil ved henting av behandlinger", error);

        settState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Kunne ikke hente behandlinger",
          laster: false,
        }));
      }
    };

    hentBehandlinger();
  }, [fagsakId]);

  return state;
}
