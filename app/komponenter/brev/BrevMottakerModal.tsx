import { HStack, Modal, VStack } from "@navikt/ds-react";
import React from "react";
import { BrevmottakereListe } from "~/komponenter/brev/BrevmottakereListe";
import { type Brevmottaker } from "~/hooks/useBrevmottaker";
import { ManueltSøk } from "~/komponenter/brev/ManueltSøk";
import { Skillelinje } from "~/komponenter/layout/Skillelinje";
import { SkalBrukerMottaBrev } from "~/komponenter/brev/SkalBrukerMottaBrev";

interface Props {
  mottakere: Brevmottaker[];
  leggTilMottaker: (mottaker: Brevmottaker) => void;
  fjernMottaker: (index: number) => void;
}

export default function BrevmottakerModalInnhold({
  mottakere,
  leggTilMottaker,
  fjernMottaker,
}: Props) {
  return (
    <Modal.Body>
      <HStack gap={"4"}>
        <VStack gap={"4"} width={"47%"}>
          <ManueltSøk leggTilMottaker={leggTilMottaker} />
          <Skillelinje />
          <SkalBrukerMottaBrev
            mottakere={mottakere}
            leggTilMottaker={leggTilMottaker}
            fjernMottaker={fjernMottaker}
          />
        </VStack>
        <Skillelinje />
        <VStack width={"47%"}>
          <BrevmottakereListe mottakere={mottakere} fjernMottaker={fjernMottaker} />
        </VStack>
      </HStack>
    </Modal.Body>
  );
}
