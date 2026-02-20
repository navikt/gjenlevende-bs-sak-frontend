import React, { useState } from "react";
import { Box, Button, Heading, HStack, Modal, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/brev";
import { BrevSide } from "~/komponenter/brev/BrevSide";
import { useBrevmottaker } from "~/hooks/useBrevmottaker";
import BrevmottakerModalInnhold from "~/komponenter/brev/BrevMottakerModal";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useNavigate } from "react-router";
import { useBehandlingSteg } from "~/hooks/useBehandlingSteg";
import type { StegPath } from "~/komponenter/navbar/BehandlingFaner";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Brev" },
    {
      name: "Brev",
      content: "Brevside",
    },
  ];
}

const STEG_PATH: StegPath = "brev";

export default function Brev() {
  const [modalÅpen, settModalÅpen] = useState(false);
  const { behandlingId } = useBehandlingContext();
  const { mottakere, settMottakere, utledBrevmottakere, sendMottakereTilSak } =
    useBrevmottaker(behandlingId);
  const navigate = useNavigate();
  const { finnForrigeSteg } = useBehandlingSteg();

  const navigerTilForrige = () => {
    const forrigeSteg = finnForrigeSteg(STEG_PATH);
    if (forrigeSteg) {
      navigate(`../${forrigeSteg.path}`, { relative: "path" });
    }
  };

  return (
    <VStack gap="space-24">
      <Box shadow="dialog" background="neutral-soft" padding="space-24" borderRadius="4">
        <VStack gap="space-8">
          <HStack align="center" justify="space-between">
            <Heading level="1" size="medium">
              Brevmottaker: {utledBrevmottakere()}
            </Heading>
            <Button variant={"tertiary"} onClick={() => settModalÅpen(true)}>
              Legg til/endre brevmottaker
            </Button>
          </HStack>
          <BrevSide />
        </VStack>
      </Box>

      <Modal
        open={modalÅpen}
        onClose={() => settModalÅpen(false)}
        header={{ heading: "Hvem skal motta brevet?" }}
        width={"50rem"}
      >
        <BrevmottakerModalInnhold
          mottakere={mottakere}
          settMottakere={settMottakere}
          lukkModal={() => settModalÅpen(false)}
          sendMottakereTilSak={sendMottakereTilSak}
        />
      </Modal>

      <HStack justify="start">
        <Button variant="tertiary" onClick={navigerTilForrige}>
          Tilbake
        </Button>
      </HStack>
    </VStack>
  );
}
