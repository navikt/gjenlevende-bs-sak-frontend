import { useEffect, useState } from "react";
import { hentVedtakForBehandling } from "~/api/backend";
import type {IVedtak} from "~/komponenter/behandling/vedtak/vedtak";

interface VedtakState {
    vedtak: IVedtak | null;
    melding: string | null;
    laster: boolean;
}

export function useHentVedtak(behandlingId: string | undefined) {
    const [state, settState] = useState<VedtakState>({
        vedtak: null,
        melding: null,
        laster: true,
    });

    useEffect(() => {
        const hentVedtak = async () => {
            if (!behandlingId) {
                settState((prev) => ({
                    ...prev,
                    melding: "Mangler fagsakId",
                    laster: false,
                }));
                return;
            }

            settState((prev) => ({ ...prev, melding: null, laster: true }));

            const response = await hentVedtakForBehandling(behandlingId);

            if (response.data) {
                settState((prev) => ({
                    ...prev,
                    vedtak: response.data ?? null,
                    laster: false,
                }));
            }
        };

        hentVedtak();
    }, [behandlingId]);

    return state;
}
