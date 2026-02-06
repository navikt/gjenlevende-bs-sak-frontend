import { Select } from "@navikt/ds-react";
import React, { useState } from "react";
import { OrganisasjonsSøk } from "~/komponenter/brev/OrganisasjonSøk";
import { PersonSøk } from "~/komponenter/brev/PersonSøk";
import type { Brevmottaker } from "~/hooks/useBrevmottaker";

enum Søktype {
  ORGANISASJON = "ORGANISASJON",
  PERSON = "PERSON",
}

interface Props {
  leggTilMottaker: (mottaker: Brevmottaker) => void;
}

export const ManueltSøk = ({ leggTilMottaker }: Props) => {
  const [søktype, settSøktype] = useState<Søktype>();

  return (
    <>
      <Select
        label="Manuelt søk"
        value={søktype}
        onChange={(e) => settSøktype(e.target.value as Søktype)}
        style={{ width: "50%" }}
      >
        <option value="">Velg</option>
        <option value={Søktype.ORGANISASJON}>Organisasjon</option>
        <option value={Søktype.PERSON}>Person</option>
      </Select>
      {søktype === Søktype.ORGANISASJON && (
        <OrganisasjonsSøk leggTilMottaker={leggTilMottaker} />
      )}
      {søktype === Søktype.PERSON && <PersonSøk leggTilMottaker={leggTilMottaker} />}
    </>
  );
};
