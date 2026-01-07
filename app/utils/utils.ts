import {format, parseISO } from "date-fns";
import type { Navn } from "~/api/backend";

export const formaterNavn = (navn: Navn): string => {
  const deler = [navn.fornavn, navn.mellomnavn, navn.etternavn]
    .filter((del): del is string => Boolean(del))
    .map((del) => del.charAt(0).toUpperCase() + del.slice(1).toLowerCase());
  return deler.join(" ");
};

export const erGyldigPersonident = (verdi: string): boolean => /^\d{11}$/.test(verdi.trim());

export const erGyldigFagsakPersonId = (verdi: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(verdi.trim());

export const erGyldigSøkestreng = (søkestreng: string): boolean => {
  return erGyldigPersonident(søkestreng) || erGyldigFagsakPersonId(søkestreng);
};

export const formaterIsoDatoTidMedSekunder = (dato: string): string => {
    return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm:ss");
};