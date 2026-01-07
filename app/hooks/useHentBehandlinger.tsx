import { useEffect, useState } from "react";
import {hentBehandlingerForFagsak} from "~/api/backend";
import type {Behandling} from "~/types/behandling";

interface BehandlingerState {
    behandlinger: [Behandling] | null;
    error: string | null;
    laster: boolean;
}

export function useHentBehandlinger(fagsakId: string | undefined) {
    const [state, settState] = useState<BehandlingerState>({
        behandlinger: null,
        error: null,
        laster: true,
    });

    useEffect(() => {

        const hentBehandlinger = async () => {

            if (!fagsakId) {
                settState((prev) => ({
                    ...prev,
                    error: "Mangler fagsakId",
                    laster: false,
                }));
                return;
            }

            settState((prev) => ({ ...prev, error: null, laster: true }));

            try {
                const response = await hentBehandlingerForFagsak(fagsakId);

                if (response.error) {
                    settState((prev) => ({
                        ...prev,
                        error: response.error ?? "Ukjent feil",
                        laster: false,
                    }));
                } else if (response.data) {
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
                    error:
                        error instanceof Error ? error.message : "Kunne ikke hente behandlinger",
                    laster: false,
                }));
            }
        };

        hentBehandlinger();
    }, [fagsakId]);

    return state;
}
