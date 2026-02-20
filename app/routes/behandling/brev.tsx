import React, { useEffect, useState } from "react";
import { Box, Button, Heading, HGrid, HStack, Modal, Select, VStack } from "@navikt/ds-react";
import { PlusIcon } from "@navikt/aksel-icons";
import type { Route } from "./+types/brev";
import { brevmaler } from "~/komponenter/brev/brevmaler";
import { useBrev } from "~/komponenter/brev/useBrev";
import { Fritekstbolk } from "~/komponenter/brev/Fritekstbolk";
import { PdfForhåndsvisning } from "~/komponenter/brev/PdfForhåndsvisning";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useBrevmottaker } from "~/hooks/useBrevmottaker";
import BrevmottakerModalInnhold from "~/komponenter/brev/BrevMottakerModal";
import { useStegNavigering } from "~/hooks/useStegNavigering";
import { useBeslutter } from "~/hooks/useBeslutter";
import { useErLesevisning } from "~/hooks/useErLesevisning";
import { oppdaterEndringshistorikk } from "~/utils/endringshistorikkEvent";
import type { StegPath } from "~/komponenter/navbar/BehandlingFaner";
import styles from "./brev.module.css";

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
    <VStack className={styles.side} gap="space-24">
      <Box
        shadow="dialog"
        background="neutral-soft"
        padding="space-24"
        borderRadius="4"
        overflow="hidden"
        className={styles.brevBoks}
      >
        <HGrid
          columns="5fr 7fr"
          gap="space-24"
          minHeight="0"
          flexGrow="1"
          className={styles.innholdGrid}
        >
          {/* Venstre kolonne */}
          <VStack
            gap="space-24"
            overflow="auto"
            minHeight="0"
            flexGrow="1"
            className={`${styles.fokusringPadding} ${styles.venstreKolonne}`}
          >
            <Heading level="1" size="small">
              Brevmottaker: {utledBrevmottakere()}
            </Heading>
            <div>
              <Button variant="secondary" size={"small"} onClick={() => settModalÅpen(true)}>
                Legg til/endre brevmottaker
              </Button>
            </div>
            <Select
              label="Velg dokument"
              value={brevMal?.tittel ?? ""}
              onChange={(e) => velgBrevmal(e.target.value)}
              size="medium"
              disabled={erLesevisning}
            >
              <option value="" disabled>
                Ikke valgt
              </option>
              {brevmaler.map((mal) => (
                <option key={mal.tittel} value={mal.tittel}>
                  {mal.tittel}
                </option>
              ))}
            </Select>

            {brevMal && (
              <>
                <Heading level="3" size="xsmall">
                  Fritekstområde
                </Heading>
                {fritekstbolker.map((fritekstfelt, index) => (
                  <Fritekstbolk
                    key={index}
                    underoverskrift={fritekstfelt.underoverskrift}
                    innhold={fritekstfelt.innhold}
                    handleOppdaterFelt={(partial) => oppdaterFelt(index, partial)}
                    handleFlyttOpp={() => flyttBolkOpp(index)}
                    handleFlyttNed={() => flyttBolkNed(index)}
                    handleSlett={() => slettFritekstbolk(index)}
                    fritekstfeltListe={fritekstbolker}
                  />
                ))}
                <Button
                  variant="tertiary"
                  icon={<PlusIcon title="Legg til fritekstfelt" />}
                  onClick={leggTilFritekstbolk}
                  disabled={erLesevisning}
                >
                  Legg til fritekstfelt
                </Button>
              </>
            )}
          </VStack>

          {/* Høyre kolonne */}
          <Box overflow="hidden" borderRadius="2" background="neutral-soft" minHeight="0">
            {brevMal ? (
              <PdfForhåndsvisning brevmal={brevMal} fritekstbolker={fritekstbolker} />
            ) : (
              <div className={styles.pdfTomtilstand}>Velg et dokument for å se forhåndsvisning</div>
            )}
          </Box>
        </HGrid>
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

      <HStack justify="space-between" flexShrink="0">
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
              Send PDF til sak
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
