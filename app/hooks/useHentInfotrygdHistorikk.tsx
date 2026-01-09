import { useEffect, useState } from "react";
import { hentHistorikkForPerson } from "~/api/backend";

interface HistorikkState {
  data: unknown | null;
  melding: string | null;
  laster: boolean;
}

export const useHentInfotrygdHistorikk = (personident: string | undefined) => {
  const [state, settState] = useState<HistorikkState>({
    data: null,
    melding: null,
    laster: true,
  });

  useEffect(() => {
    let avbrutt = false;

    const hentHistorikk = async () => {
      if (!personident) {
        settState({
          data: null,
          melding: null,
          laster: false,
        });
        return;
      }

      try {
        const response = await hentHistorikkForPerson(personident);

        if (avbrutt) return;

        if (response.data) {
          settState({
            data: response.data,
            melding: null,
            laster: false,
          });
        } else {
          settState({
            data: null,
            melding: response.melding || null,
            laster: false,
          });
        }
      } catch (error) {
        if (avbrutt) return;

        console.error("Feil ved henting av historikk:", error);
        settState({
          data: null,
          melding: error instanceof Error ? error.message : null,
          laster: false,
        });
      }
    };

    hentHistorikk();

    return () => {
      avbrutt = true;
    };
  }, [personident]);

  return state;
};
