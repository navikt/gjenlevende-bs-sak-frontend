import React, { useState } from "react";
import { Button, Heading, Modal, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/brev";
import { BrevSide } from "~/komponenter/brev/BrevSide";
import { useBrevmottaker } from "~/hooks/useBrevmottaker";
import BrevmottakerModalInnhold from "~/komponenter/brev/BrevMottakerModal";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Brev" },
    {
      name: "Brev",
      content: "Brevside",
    },
  ];
}

export default function Brev() {
  const [modalÅpen, settModalÅpen] = useState(false);
  const { mottakere, settMottakere, utledBrevmottakere, sendMottakereTilSak } = useBrevmottaker();

  return (
    <VStack gap="space-4">
      <Heading level="1" size="medium">
        Brevmottaker: {utledBrevmottakere()}
        <Button variant={"tertiary"} onClick={() => settModalÅpen(true)}>
          Legg til/endre brevmottaker
        </Button>
      </Heading>
      <BrevSide />

      <Modal
        open={modalÅpen}
        onClose={() => settModalÅpen(false)}
        header={{ heading: "Hvem skal motta brevet?" }}
        width={"70rem"}
        style={{ height: "40rem" }}
      >
        <BrevmottakerModalInnhold
          mottakere={mottakere}
          settMottakere={settMottakere}
          lukkModal={() => settModalÅpen(false)}
          sendMottakereTilSak={sendMottakereTilSak}
        />
      </Modal>
    </VStack>
  );
}
