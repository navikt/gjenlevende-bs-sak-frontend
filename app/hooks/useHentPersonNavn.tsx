import { useEffect, useState } from "react";
import { hentNavnFraPdl, type Navn } from "~/api/backend";

interface PersonNavnState {
  navn: Navn | null;
  melding: string | null;
  laster: boolean;
}

export function useHentPersonNavn(fagsakPersonId: string | undefined) {
  const [state, settState] = useState<PersonNavnState>({
    navn: null,
    melding: null,
    laster: true,
  });

  useEffect(() => {
    let avbrutt = false;

    const hentNavn = async () => {
      if (avbrutt) return;

      if (!fagsakPersonId) {
        settState((prev) => ({
          ...prev,
          navn: null,
          melding: null,
          laster: false,
        }));
        return;
      }

      settState((prev) => ({ ...prev, melding: null, laster: true }));

      try {
        const response = await hentNavnFraPdl(fagsakPersonId);

        if (avbrutt) return;

        if (response.data) {
          settState((prev) => ({
            ...prev,
            navn: response.data ?? null,
            laster: false,
          }));
        } else {
          settState((prev) => ({
            ...prev,
            navn: null,
            melding: response.melding ?? "Fant ikke navn i PDL",
            laster: false,
          }));
        }
      } catch (error) {
        if (avbrutt) return;
        console.error("Feil ved henting av navn fra PDL:", error);

        settState((prev) => ({
          ...prev,
          melding: error instanceof Error ? error.message : "Kunne ikke hente navn",
          laster: false,
        }));
      }
    };

    hentNavn();

    return () => {
      avbrutt = true;
    };
  }, [fagsakPersonId]);

  return state;
}
