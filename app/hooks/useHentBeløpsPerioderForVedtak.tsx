import {useCallback, useEffect, useRef, useState} from "react";
import {apiCall, type ApiResponse} from "~/api/backend";
import type {
    BeløpsperioderDto,
    IBarnetilsynperiode
} from "~/komponenter/behandling/vedtak/vedtak";
import type { BarnetilsynBeregningRequest } from "~/komponenter/behandling/vedtak/vedtak";

interface BeløpsperioderState {
    beløpsperioderDto: BeløpsperioderDto | null;
    melding: string | null;
    laster: boolean;
}




export function useHentBeløppsperioderManual() {
    useEffect(() => {
        const hentBeløpsperioderForVedtak = async(
            behandlingId: string,
            barnetilsynBeregningRequest: BarnetilsynBeregningRequest
        ): Promise<ApiResponse<BeløpsperioderDto>> => {
            return apiCall(`/vedtak/${behandlingId}/beregn`, {
                method: "POST",
                body: JSON.stringify(barnetilsynBeregningRequest)
            });
        }



    const [state, settState] = useState<BeløpsperioderState>({
        beløpsperioderDto: null,
        melding: null,
        laster: false,
    });
    const behandlingIdRef = useRef<string | undefined>();
    const perioderRef = useRef<IBarnetilsynperiode[]>();

    const hent = useCallback(async (behandlingId: string | undefined, barnetilsynsperioder: IBarnetilsynperiode[]) => {
        behandlingIdRef.current = behandlingId;
        perioderRef.current = barnetilsynsperioder;
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
                .filter(periode => periode.periodetype !== undefined)
                .map(periode => ({
                    datoFra: periode.datoFra,
                    datoTil: periode.datoTil,
                    utgifter: periode.utgifter,
                    barn: periode.barn,
                    periodetype: periode.periodetype!
                }))
        };
        const response = await hentBeløpsperioderForVedtak(behandlingId, request);
        if (response.data) {
            settState((prev) => ({
                ...prev,
                beløpsperioderDto: response.data ?? null,
                laster: false,
            }));
        }
    }, []);

    return { ...state, hent };
    })
}
