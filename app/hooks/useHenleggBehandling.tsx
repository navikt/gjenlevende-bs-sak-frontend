import { useState } from "react";
import { apiCall } from "~/api/backend";

interface HenleggBehandling {
  henleggBehandling: (behandlingId: string) => Promise<boolean>;
  henlegger: boolean;
  henleggFeilmelding: string | null;
}

export const useHenleggBehandling = (): HenleggBehandling => {
  const [henlegger, settHenlegger] = useState(false);
  const [henleggFeilmelding, settHenleggFeilmelding] = useState<string | null>(null);

  const henleggBehandling = async (behandlingId: string): Promise<boolean> => {
    settHenlegger(true);
    settHenleggFeilmelding(null);

    const response = await apiCall(`/behandling/henlegg`, {
      method: "POST",
      body: JSON.stringify({ behandlingId }),
    });

    if (response.melding) {
      settHenleggFeilmelding(response.melding);
      settHenlegger(false);
      return false;
    }

    settHenlegger(false);
    return true;
  };

  return {
    henleggBehandling,
    henlegger,
    henleggFeilmelding,
  };
};
