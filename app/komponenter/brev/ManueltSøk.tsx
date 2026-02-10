import { BodyShort, Select } from "@navikt/ds-react";
import React, { useState } from "react";
import { OrganisasjonsSøk } from "~/komponenter/brev/OrganisasjonSøk";
import { PersonSøk } from "~/komponenter/brev/PersonSøk";
import { type Brevmottaker, MottakerType } from "~/hooks/useBrevmottaker";

interface Props {
  leggTilMottaker: (mottaker: Brevmottaker) => void;
}

export const ManueltSøk = ({ leggTilMottaker }: Props) => {
  const [søktype, settSøktype] = useState<MottakerType>();

  return (
    <>
      <BodyShort size={"large"}>Manuelt søk</BodyShort>
      <Select
        label="Manuelt søk"
        hideLabel
        value={søktype}
        onChange={(e) => settSøktype(e.target.value as MottakerType)}
        style={{ width: "50%" }}
      >
        <option value="">Velg</option>
        <option value={MottakerType.ORGANISASJON}>Organisasjon</option>
        <option value={MottakerType.PERSON}>Person</option>
      </Select>
      {søktype === MottakerType.ORGANISASJON && (
        <OrganisasjonsSøk leggTilMottaker={leggTilMottaker} />
      )}
      {søktype === MottakerType.PERSON && <PersonSøk leggTilMottaker={leggTilMottaker} />}
    </>
  );
};
