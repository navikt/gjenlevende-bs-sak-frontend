import { BodyShort, HStack, Modal, Radio, RadioGroup, VStack } from "@navikt/ds-react";
import React from "react";
import { BrevmottakereListe } from "~/komponenter/brev/BrevmottakereListe";
import { type Brevmottaker, BrevmottakerRolle } from "~/hooks/useBrevmottaker";
import { ManueltSøk } from "~/komponenter/brev/ManueltSøk";

interface Props {
  mottakere: Brevmottaker[];
  leggTilMottaker: (mottaker: Brevmottaker) => void;
  fjernMottaker: (index: number) => void;
}

export default function BrevmottakerModalInnhold({ mottakere, leggTilMottaker, fjernMottaker }: Props) {
  const brukerSkalHaBrev = mottakere.some(
    (mottaker) => mottaker.personRolle === BrevmottakerRolle.BRUKER
  );

  return (
    <Modal.Body>
      <HStack gap={"4"}>
        <VStack gap={"4"} minWidth={"47%"}>
          <ManueltSøk leggTilMottaker={leggTilMottaker} />
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
