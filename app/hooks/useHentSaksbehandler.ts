import { useEffect, useState } from "react";
import { apiCall } from "~/api/backend";

interface SaksbehandlerState {
  visningNavn: string | null;
  laster: boolean;
}

export function useHentSaksbehandler(navIdent: string | undefined) {
  const [state, settState] = useState<SaksbehandlerState>({
    visningNavn: null,
    laster: true,
  });

  useEffect(() => {
    const hentSaksbehandler = async () => {
      if (!navIdent) {
        settState((prev) => ({ ...prev, laster: false }));
        return;
      }

      settState((prev) => ({ ...prev, laster: true }));

      const response = await apiCall<{ visningNavn: string }>(
        `/saksbehandler/hent`,
        {
          method: "POST",
          body: JSON.stringify({ navIdent }),
        }
      );

      if (response.data) {
        settState({
          visningNavn: response.data.visningNavn,
          laster: false,
        });
      } else {
        settState({
          visningNavn: null,
          laster: false,
        });
      }
    };

    hentSaksbehandler();
  }, [navIdent]);

  return state;
}
