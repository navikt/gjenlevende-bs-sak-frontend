import { useEffect, useState } from "react";
import { hentEllerOpprettFagsak, type FagsakDto } from "~/api/backend";

interface FagsakState {
  fagsak: FagsakDto | null;
  error: string | null;
  melding: string | null;
  laster: boolean;
}

export const useFagsak = (fagsakPersonId: string | undefined) => {
  const [state, settState] = useState<FagsakState>({
    fagsak: null,
    error: null,
    melding: null,
    laster: true,
  });

  useEffect(() => {
    if (!fagsakPersonId) {
      settState({
        fagsak: null,
        error: "Mangler fagsakPersonId",
        melding: null,
        laster: false,
      });
      return;
    }

    let avbrutt = false;

    const hentFagsak = async () => {
      settState((prev) => ({
        ...prev,
        laster: true,
        error: null,
        melding: null,
      }));

      try {
        const response = await hentEllerOpprettFagsak(fagsakPersonId);
        if (avbrutt) return;

        const fagsak = response.data?.data ?? null;

        if (fagsak) {
          settState({ fagsak, error: null, melding: null, laster: false });
        } else {
          settState({
            fagsak: null,
            error:
              response.data?.frontendFeilmelding ||
              response.error ||
              "Fant ikke fagsak",
            melding: response.data?.melding ?? response.melding ?? null,
            laster: false,
          });
        }
      } catch (error) {
        if (avbrutt) return;

        settState({
          fagsak: null,
          error: "Kunne ikke hente fagsak",
          melding: error instanceof Error ? error.message : null,
          laster: false,
        });
      }
    };

    hentFagsak();

    return () => {
      avbrutt = true;
    };
  }, [fagsakPersonId]);

  return state;
};
