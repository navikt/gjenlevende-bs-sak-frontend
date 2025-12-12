import { useEffect, useState } from "react";
import {hentDokumenterForPerson} from "~/api/backend";
import type {Dokumentinfo} from "~/api/dokument";

interface JournalposterState {
  dokumenter: [Dokumentinfo] | null;
  error: string | null;
  laster: boolean;
}

export function useHentDokumenter(fagsakPersonId: string | undefined) {
  const [state, settState] = useState<JournalposterState>({
    dokumenter: null,
    error: null,
    laster: true,
  });

  useEffect(() => {
    let avbrutt = false;

    const hentDokumenter = async () => {
      if (avbrutt) return;

      if (!fagsakPersonId) {
        settState((prev) => ({
          ...prev,
          error: "Mangler fødselsnummer",
          laster: false,
        }));
        return;
      }

      settState((prev) => ({ ...prev, error: null, laster: true }));

      try {
        const response = await hentDokumenterForPerson(fagsakPersonId);

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

    hentDokumenter();

    return () => {
      avbrutt = true;
    };
  }, [fagsakPersonId]);

  return state;
}
