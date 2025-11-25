import { useEffect, useState } from "react";
import { hentHistorikkForPerson } from "~/api/backend";

interface HistorikkState {
  data: unknown | null;
  feil: string | null;
  melding: string | null;
  laster: boolean;
}

export const useHentInfotrygdHistorikk = (fagsakPersonId: string) => {
  const [state, settState] = useState<HistorikkState>({
    data: null,
    feil: null,
    melding: null,
    laster: true,
  });

  useEffect(() => {
    let avbrutt = false;

    const hentHistorikk = async () => {
      try {
        const response = await hentHistorikkForPerson(fagsakPersonId);

        if (avbrutt) return;

        if (response.data) {
          settState({
            data: response.data,
            feil: null,
            melding: null,
            laster: false,
          });
        } else if (response.error) {
          console.error("Feil fra backend:", response.error, response.melding);
          settState({
            data: null,
            feil: response.error,
            melding: response.melding ?? null,
            laster: false,
          });
        }
      } catch (error) {
        if (avbrutt) return;

        console.error("Feil ved henting av historikk:", error);
        settState({
          data: null,
          feil: "Ukjent feil",
          melding: error instanceof Error ? error.message : null,
          laster: false,
        });
      }
    };

    hentHistorikk();

    return () => {
      avbrutt = true;
    };
  }, [fagsakPersonId]);

  return state;
};
