import { useState, useEffect, useCallback } from "react";
import { søkPerson, type Søkeresultat } from "~/api/backend";
import { erGyldigSøkestreng } from "~/utils/utils";

interface UseSøkReturn {
  søk: string;
  søkeresultat: Søkeresultat | null;
  søker: boolean;
  feilmelding: string | null;
  settSøk: (value: string) => void;
  tilbakestillSøk: () => void;
}

export const useSøk = (): UseSøkReturn => {
  const [søk, settSøk] = useState<string>("");
  const [søkeresultat, settSøkeresultat] = useState<Søkeresultat | null>(null);
  const [søker, settSøker] = useState(false);
  const [feilmelding, settFeilmelding] = useState<string | null>(null);

  const utførSøk = useCallback(async (søkestreng: string) => {
    settSøker(true);
    settFeilmelding(null);
    settSøkeresultat(null);

    const response = await søkPerson(søkestreng);

    if (response.status) {
      settFeilmelding(response.status);
    } else if (response.data) {
      settSøkeresultat(response.data);
    }

    settSøker(false);
  }, []);

  const tilbakestillSøk = useCallback(() => {
    settSøk("");
    settSøkeresultat(null);
    settFeilmelding(null);
  }, []);

  useEffect(() => {
    const trimmetSøk = søk.trim();

    if (erGyldigSøkestreng(trimmetSøk)) {
      utførSøk(trimmetSøk);
    } else if (trimmetSøk === "") {
      settSøkeresultat(null);
      settFeilmelding(null);
    }
  }, [søk, utførSøk]);

  return {
    søk,
    søkeresultat,
    søker,
    feilmelding,
    settSøk,
    tilbakestillSøk,
  };
};
