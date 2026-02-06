import { BodyShort, HStack, Modal, Radio, RadioGroup, Select, VStack } from "@navikt/ds-react";
import { OrganisasjonsSøk } from "~/komponenter/brev/OrganisasjonSøk";
import React, { useState } from "react";
import { BrevmottakereListe } from "~/komponenter/brev/BrevmottakereListe";
import { type Brevmottaker, BrevmottakerRolle } from "~/hooks/useBrevmottaker";
import { PersonSøk } from "~/komponenter/brev/PersonSøk";

enum Søktype {
  ORGANISASJON = "ORGANISASJON",
  PERSON = "PERSON",
}

interface Props {
  mottakere: Brevmottaker[];
  leggTilMottaker: (mottaker: Brevmottaker) => void;
  fjernMottaker: (index: number) => void;
}

export default function BrevmottakerModalInnhold({ mottakere, leggTilMottaker, fjernMottaker }: Props) {
  const [søktype, settSøktype] = useState<Søktype>();
  const brukerSkalHaBrev = mottakere.some(
    (mottaker) => mottaker.personRolle === BrevmottakerRolle.BRUKER
  );

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
          {søktype === Søktype.PERSON && <PersonSøk leggTilMottaker={leggTilMottaker} />}
          <div style={{ border: "2px solid #f3f3f3" }}></div>
          <BodyShort>Skal bruker motta brevet?</BodyShort>
          <RadioGroup
            legend={"Skal bruker motta brevet?"}
            hideLegend
            value={brukerSkalHaBrev ? "Ja" : "Nei"}
          >
            <Radio value={"Ja"} name={"brukerHaBrevRadio"} onChange={() => {}}>
              Ja
            </Radio>
            <Radio value={"Nei"} name={"brukerHaBrevRadio"} onChange={() => {}}>
              Nei
            </Radio>
          </RadioGroup>
        </VStack>
        <div style={{ border: "2px solid #f3f3f3" }}></div>
        <VStack minWidth={"47%"}>
          <BrevmottakereListe mottakere={mottakere} fjernMottaker={fjernMottaker} />
        </VStack>
      </HStack>
    </Modal.Body>
  );
}
