import {useEffect} from "react";
import type { IVedtak } from "~/komponenter/behandling/vedtak/vedtak";
import {apiCall, type ApiResponse} from "~/api/backend";

interface LagreVedtak {
  lagreVedtak: (behandlingId: string, vedtak: IVedtak);
  oppretter: boolean;
  opprettFeilmelding: string | null;
}




export function useLagreVedtak() {
    useEffect(() => {
        const lagreVedtakForBehandling = async(
            behandlingId: string,
            vedtak: IVedtak
        ): Promise<ApiResponse<string>> => {
            return apiCall(`/vedtak/${behandlingId}/lagre-vedtak`, {
                method: "POST",
                body: JSON.stringify(vedtak)
            });
        }

  const lagreVedtak = async (behandlingId: string, vedtak: IVedtak): Promise<string | undefined> => {

    const response = await lagreVedtakForBehandling(behandlingId, vedtak);

    if (!response.data && response.melding) {
      return undefined;
    }
    return response.data;
  };

  return {
    lagreVedtak,
  };
    })
}
