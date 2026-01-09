import { useEffect, useState } from "react";
import { hentDokumenterForPerson } from "~/api/backend";
import type { Dokumentinfo } from "~/api/dokument";

interface DokumenterState {
  dokumenter: [Dokumentinfo] | null;
  melding: string | null;
  laster: boolean;
}

export function useHentDokumenter(fagsakPersonId: string | undefined) {
  const [state, settState] = useState<DokumenterState>({
    dokumenter: null,
    melding: null,
    laster: true,
  });

  useEffect(() => {
    let avbrutt = false;

    const hentDokumenter = async () => {
      if (avbrutt) return;

      if (!fagsakPersonId) {
        settState((prev) => ({
          ...prev,
          melding: "Mangler fagsakId",
          laster: false,
        }));
        return;
      }

      settState((prev) => ({ ...prev, melding: null, laster: true }));

      try {
        const response = await hentDokumenterForPerson(fagsakPersonId);

        if (avbrutt) return;

        if (response.data) {
          settState((prev) => ({
            ...prev,
            dokumenter: response.data ?? null,
            laster: false,
          }));
        }
      } catch (error) {
        if (avbrutt) return;
        console.error("Feil ved henting av journalposter fra SAF:", error);

        settState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Kunne ikke hente journalposter",
          laster: false,
        }));
      }
    };

    hentDokumenter();

    return () => {
      avbrutt = true;
    };
  }, [fagsakPersonId]);

  return state;
}
