import type { Navn } from "~/api/backend";

export const formaterNavn = (navn: Navn): string => {
  const deler = [navn.fornavn, navn.mellomnavn, navn.etternavn]
    .filter((del): del is string => Boolean(del))
    .map((del) => del.charAt(0).toUpperCase() + del.slice(1).toLowerCase());
  return deler.join(" ");
};
