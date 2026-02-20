import React, { useEffect, useState } from "react";
import { Box, Button, Heading, HStack, Modal, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/brev";
import { BrevSide } from "~/komponenter/brev/BrevSide";
import { useBrevmottaker } from "~/hooks/useBrevmottaker";
import BrevmottakerModalInnhold from "~/komponenter/brev/BrevMottakerModal";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import type { StegPath } from "~/komponenter/navbar/BehandlingFaner";
import { useStegNavigering } from "~/hooks/useStegNavigering";
import { useBrev } from "~/komponenter/brev/useBrev";
import { useBeslutter } from "~/hooks/useBeslutter";
import { useErLesevisning } from "~/hooks/useErLesevisning";
import { oppdaterEndringshistorikk } from "~/utils/endringshistorikkEvent";

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
  const erLesevisning = useErLesevisning();
  const [modalÅpen, settModalÅpen] = useState(false);
  const { behandlingId, revaliderBehandling, behandling } = useBehandlingContext();
  const { mottakere, settMottakere, utledBrevmottakere, sendMottakereTilSak } =
    useBrevmottaker(behandlingId);

  const {
    brevMal,
    fritekstbolker,
    sender,
    leggTilFritekstbolk,
    flyttBolkOpp,
    flyttBolkNed,
    oppdaterFelt,
    velgBrevmal,
    sendPdfTilSak,
    mellomlagreBrev,
    slettFritekstbolk,
  } = useBrev(behandlingId);

  const erSendtTilBeslutter = behandling?.status === "FATTER_VEDTAK";
  const { sender: senderTilBeslutter, sendTilBeslutter } = useBeslutter();
  const { navigerTilForrige, harForrigeSteg } = useStegNavigering(STEG_PATH);

  useEffect(() => {
    if (!brevMal) return;
    const timer = setTimeout(() => {
      mellomlagreBrev(behandlingId, brevMal, fritekstbolker);
    }, 5000);

    return () => clearTimeout(timer);
  }, [behandlingId, brevMal, fritekstbolker, mellomlagreBrev]);

  const handleSendTilBeslutter = async () => {
    const respons = await sendTilBeslutter(behandlingId);
    if (respons.data) {
      oppdaterEndringshistorikk();
      revaliderBehandling();
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
            <Button variant="tertiary" onClick={() => settModalÅpen(true)}>
              Legg til/endre brevmottaker
            </Button>
          </HStack>
          <BrevSide
            brevMal={brevMal}
            fritekstbolker={fritekstbolker}
            velgBrevmal={velgBrevmal}
            leggTilFritekstbolk={leggTilFritekstbolk}
            flyttBolkOpp={flyttBolkOpp}
            flyttBolkNed={flyttBolkNed}
            oppdaterFelt={oppdaterFelt}
            slettFritekstbolk={slettFritekstbolk}
          />
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

      <HStack justify="space-between">
        {harForrigeSteg && (
          <Button variant="secondary" onClick={navigerTilForrige}>
            Tilbake
          </Button>
        )}
        {brevMal && (
          <HStack gap="space-24">
            <Button
              variant="secondary"
              onClick={() => sendPdfTilSak(behandlingId, brevMal, fritekstbolker)}
              disabled={sender || erLesevisning}
            >
              Send pdf til sak
            </Button>
            <Button
              onClick={handleSendTilBeslutter}
              disabled={senderTilBeslutter || erLesevisning || erSendtTilBeslutter}
            >
              Send til beslutter
            </Button>
          </HStack>
        )}
      </HStack>
    </VStack>
  );
}
