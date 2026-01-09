import { useEffect, useState } from "react";
import { hentEllerOpprettFagsak, type FagsakDto } from "~/api/backend";

interface FagsakState {
  fagsak: FagsakDto | null;
  melding: string | null;
  laster: boolean;
}

export const useFagsak = (fagsakPersonId: string | undefined) => {
  const [state, settState] = useState<FagsakState>({
    fagsak: null,
    melding: null,
    laster: true,
  });

  useEffect(() => {
    if (!fagsakPersonId) {
      settState({
        fagsak: null,
        melding: null,
        laster: false,
      });
      return;
    }

    let avbrutt = false;

    const hentFagsak = async () => {
      settState((prev) => ({
        ...prev,
        melding: null,
        laster: true,
      }));

      try {
        const response = await hentEllerOpprettFagsak(fagsakPersonId);
        if (avbrutt) return;

        const fagsak = response.data ?? null;

        if (fagsak) {
          settState({ fagsak, melding: null, laster: false });
        } else {
          settState({
            fagsak: null,
            melding: response.melding || "Fagsak ikke funnet",
            laster: false,
          });
        }
      } catch (error) {
        if (avbrutt) return;

        settState({
          fagsak: null,
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
