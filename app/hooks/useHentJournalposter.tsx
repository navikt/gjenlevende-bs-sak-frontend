import { useEffect, useState } from "react";
import {hentJournalposterMedFnr, type Journalpost} from "~/api/backend";

interface JournalposterState {
  journalposter: [Journalpost] | null;
  error: string | null;
  laster: boolean;
}

export function useHentJournalposter(fnr: string | undefined) {
  const [state, settState] = useState<JournalposterState>({
    journalposter: null,
    error: null,
    laster: true,
  });

  useEffect(() => {
    let avbrutt = false;

    const hentJournalposter = async () => {
      if (avbrutt) return;

      if (!fnr) {
        settState((prev) => ({
          ...prev,
          error: "Mangler fødselsnummer",
          laster: false,
        }));
        return;
      }

      settState((prev) => ({ ...prev, error: null, laster: true }));

      try {
        const response = await hentJournalposterMedFnr(fnr);

        if (avbrutt) return;

        if (response.error) {
          settState((prev) => ({
            ...prev,
            error: response.error ?? "Ukjent feil",
            laster: false,
          }));
        } else if (response.data) {
          settState((prev) => ({
            ...prev,
            journalposter: response.data ?? null,
            laster: false,
          }));
        }
      } catch (error) {
        if (avbrutt) return;
        console.error("Feil ved henting av journalposter fra SAF:", error);

        settState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Kunne ikke hente journalposter",
          laster: false,
        }));
      }
    };

    hentJournalposter();

    return () => {
      avbrutt = true;
    };
  }, [fnr]);

  return state;
}
