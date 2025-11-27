import { useEffect, useState } from "react";
import { hentNavnFraPdl, type Navn } from "~/api/backend";

interface PersonNavnState {
  navn: Navn | null;
  error: string | null;
  laster: boolean;
}

export function useHentPersonNavn(fagsakPersonId: string | undefined) {
  const [state, settState] = useState<PersonNavnState>({
    navn: null,
    error: null,
    laster: true,
  });

  useEffect(() => {
    let avbrutt = false;

    const hentNavn = async () => {
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
        const response = await hentNavnFraPdl(fagsakPersonId);

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
            navn: response.data ?? null,
            laster: false,
          }));
        }
      } catch (error) {
        if (avbrutt) return;
        console.error("Feil ved henting av navn fra PDL:", error);

        settState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Kunne ikke hente navn",
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
