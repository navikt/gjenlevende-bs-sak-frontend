import { useState } from "react";
import type { IVedtak } from "~/komponenter/behandling/vedtak/vedtak";
import { lagreVedtakForBehandling } from "~/api/backend";

interface LagreVedtak {
  lagreVedtak: (behandlingId: string, vedtak: IVedtak) => Promise<string | undefined>;
  oppretter: boolean;
  opprettFeilmelding: string | null;
}

export const useLagreVedtak = (): LagreVedtak => {
  const [oppretter, settOppretter] = useState(false);
  const [opprettFeilmelding, settOpprettFeilmelding] = useState<string | null>(null);

  const lagreVedtak = async (behandlingId: string, vedtak: IVedtak): Promise<string | undefined> => {
    settOppretter(true);
    settOpprettFeilmelding(null);

    const response = await lagreVedtakForBehandling(behandlingId, vedtak);

    if (!response.data && response.melding) {
      settOpprettFeilmelding(response.melding);
      settOppretter(false);
      return undefined;
    }

    settOppretter(false);
    return response.data;
  };

  return {
    lagreVedtak,
    oppretter,
    opprettFeilmelding,
  };
};
