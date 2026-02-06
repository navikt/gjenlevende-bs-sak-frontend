import { BodyShort, HStack, Modal, Select, VStack } from "@navikt/ds-react";
import { OrganisasjonsSøk } from "~/komponenter/brev/OrganisasjonSøk";
import React, { useState } from "react";
import { BrevmottakereListe } from "~/komponenter/brev/BrevmottakereListe";
import type { Brevmottaker } from "~/hooks/useBrevmottaker";

enum Søktype {
  ORGANISASJON = "ORGANISASJON",
  PERSON = "PERSON",
}

interface Props {
  mottakere: Brevmottaker[];
  leggTilMottaker: (mottaker: Brevmottaker) => void;
}

export default function BrevmottakerModalInnhold({ mottakere, leggTilMottaker }: Props) {
  const [søktype, settSøktype] = useState<Søktype>();
  return (
    <Modal.Body>
      <HStack gap={"4"}>
        <VStack gap={"4"} minWidth={"47%"}>
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
          <BodyShort>Skal bruker motta brevet?</BodyShort>
        </VStack>
        <div style={{ border: "2px solid #f3f3f3" }}></div>
        <VStack minWidth={"47%"}>
          <BrevmottakereListe mottakere={mottakere} />
        </VStack>
      </HStack>
    </Modal.Body>
  );
}
