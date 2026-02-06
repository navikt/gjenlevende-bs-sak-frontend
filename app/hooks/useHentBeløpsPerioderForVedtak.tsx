import { useCallback, useState } from "react";
import { apiCall, type ApiResponse } from "~/api/backend";
import type {
    IBeløpsperioder,
    IBarnetilsynperiode
} from "~/komponenter/behandling/vedtak/vedtak";
import type { BarnetilsynBeregningRequest } from "~/komponenter/behandling/vedtak/vedtak";

interface BeløpsperioderState {
    beløpsperioderDto: IBeløpsperioder | null;
    melding: string | null;
    laster: boolean;
}

export function useHentBeløpsPerioderForVedtak() {
    const [state, settState] = useState<BeløpsperioderState>({
        beløpsperioderDto: null,
        melding: null,
        laster: false,
    });

    const hent = useCallback(async (
        behandlingId: string | undefined,
        barnetilsynsperioder: IBarnetilsynperiode[]
    ) => {
        if (!behandlingId) {
            settState((prev) => ({
                ...prev,
                melding: "Mangler fagsakId",
                laster: false,
            }));
            return;
        }
        settState((prev) => ({ ...prev, melding: null, laster: true }));
        const request: BarnetilsynBeregningRequest = {
            barnetilsynBeregning: barnetilsynsperioder
                .filter((periode) => periode.periodetype !== undefined)
                .map((periode) => ({
                    datoFra: periode.datoFra,
                    datoTil: periode.datoTil,
                    utgifter: periode.utgifter,
                    barn: periode.barn,
                    periodetype: periode.periodetype!,
                })),
        };
        const response: ApiResponse<IBeløpsperioder> = await apiCall(
            `/vedtak/${behandlingId}/beregn`, {
                method: "POST",
                body: JSON.stringify(request),
            }
        );
        if (response.data) {
            settState((prev) => ({
                ...prev,
                beløpsperioderDto: response.data ?? null,
                laster: false,
            }));
        }
    }, []);

    return { ...state, hent };
}
