import { useState } from "react";
import type { IVedtak } from "~/komponenter/behandling/vedtak/vedtak";
import { apiCall, type ApiResponse } from "~/api/backend";

interface LagreVedtakState {
    oppretter: boolean;
    opprettFeilmelding: string | null;
}

export function useLagreVedtak() {
    const [state, settState] = useState<LagreVedtakState>({
        oppretter: false,
        opprettFeilmelding: null,
    });

    const lagreVedtak = async (
        behandlingId: string,
        vedtak: IVedtak
    ): Promise<string | undefined> => {
        settState((prev) => ({ ...prev, oppretter: true, opprettFeilmelding: null }));
        const response: ApiResponse<string> = await apiCall(
            `/vedtak/${behandlingId}/lagre-vedtak`, {
                method: "POST",
                body: JSON.stringify(vedtak),
            }
        );
        settState((prev) => ({ ...prev, oppretter: false, opprettFeilmelding: response.melding ?? null }));
        if (!response.data && response.melding) {
            return undefined;
        }
        return response.data;
    };

    return {
        ...state,
        lagreVedtak,
    };
}
