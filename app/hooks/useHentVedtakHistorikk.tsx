import {useEffect, useState} from "react";
import {apiCall, type ApiResponse} from "~/api/backend";
import type {Vedtak} from "~/komponenter/behandling/vedtak/vedtak";

interface VedtakState {
    vedtak: Vedtak | null;
    melding: string | null;
    laster: boolean;
}

export function useHentVedtakHistorikk(behandlingId: string | undefined, fra: string | null) {
    const [state, settState] = useState<VedtakState>({
        vedtak: null,
        melding: null,
        laster: false,
    });

    useEffect(() => {
        const hentVedtakForBehandling = async (
            behandlingId: string,
            fra: string
        ): Promise<ApiResponse<Vedtak>> => {
            return apiCall(`/vedtak/${behandlingId}/historikk/${fra}`, {
                method: "GET",
            });
        };

        const hentVedtakHistorikk = async () => {
            if (!behandlingId || !fra) {
                settState((prev) => ({
                    ...prev,
                    vedtak: null,
                    laster: false,
                }));
                return;
            }

            settState((prev) => ({...prev, melding: null, laster: true}));

            const response = await hentVedtakForBehandling(behandlingId, fra);

            if (response.data) {
                settState((prev) => ({
                    ...prev,
                    vedtak: response.data ?? null,
                    laster: false,
                }));
            } else {
                settState((prev) => ({
                    ...prev,
                    vedtak: null,
                    laster: false,
                }));
            }
        };

        hentVedtakHistorikk();
    }, [behandlingId, fra]);

    return state;
}
