import { useState, useEffect, useCallback } from "react";
import { søkPerson, type Søkeresultat } from "~/api/backend";
import { erGyldigFagsakPersonId, erGyldigPersonident } from "~/utils/utils";

interface UseSøkReturn {
  søk: string;
  søkeresultat: Søkeresultat | null;
  søker: boolean;
  feilmelding: string | null;
  settSøk: (value: string) => void;
  clearSøk: () => void;
}

export const useSøk = (): UseSøkReturn => {
  const [søk, settSøk] = useState<string>("");
  const [søkeresultat, setSøkeresultat] = useState<Søkeresultat | null>(null);
  const [søker, settSøker] = useState(false);
  const [feilmelding, settFeilmelding] = useState<string | null>(null);

  const erGyldigSøkestreng = useCallback((str: string): boolean => {
    const trimmet = str.trim();
    return erGyldigPersonident(trimmet) || erGyldigFagsakPersonId(trimmet);
  }, []);

  const utførSøk = useCallback(async (søkestreng: string) => {
    settSøker(true);
    settFeilmelding(null);
    setSøkeresultat(null);

    const response = await søkPerson(søkestreng);

    if (response.error) {
      settFeilmelding(response.melding || response.error);
    } else if (response.data) {
      setSøkeresultat(response.data);
    }

    settSøker(false);
  }, []);

  const clearSøk = useCallback(() => {
    settSøk("");
    setSøkeresultat(null);
    settFeilmelding(null);
  }, []);

  useEffect(() => {
    const trimmetSøk = søk.trim();

    if (erGyldigSøkestreng(trimmetSøk)) {
      utførSøk(trimmetSøk);
    } else if (trimmetSøk === "") {
      setSøkeresultat(null);
      settFeilmelding(null);
    }
  }, [søk, erGyldigSøkestreng, utførSøk]);

  return {
    søk,
    søkeresultat,
    søker,
    feilmelding,
    settSøk,
    clearSøk,
  };
};
