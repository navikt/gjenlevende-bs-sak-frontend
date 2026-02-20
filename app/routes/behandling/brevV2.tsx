import React, { useEffect, useState } from "react";
import { Box, Button, Heading, HStack, Modal, Select, VStack } from "@navikt/ds-react";
import { PlusIcon } from "@navikt/aksel-icons";
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

const STEG_PATH: StegPath = "brev-v2";

export default function BrevV2() {
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 13rem)",
        gap: "var(--ax-space-24)",
      }}
    >
      <Heading size="large" style={{ flexShrink: 0 }}>
        Brev
      </Heading>

      <Box
        shadow="dialog"
        background="neutral-soft"
        padding="space-24"
        borderRadius="4"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Mottaker-info */}
        <HStack
          align="center"
          justify="space-between"
          style={{ flexShrink: 0, paddingBottom: "var(--ax-space-24)" }}
        >
          <Heading level="1" size="small">
            Brevmottaker: {utledBrevmottakere()}
          </Heading>
          <Button variant="tertiary" onClick={() => settModalÅpen(true)}>
            Legg til/endre brevmottaker
          </Button>
        </HStack>

        {/* To-kolonner: editor (venstre) + PDF (høyre) */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: "var(--ax-space-24)",
            minHeight: 0,
          }}
        >
          {/* Venstre kolonne — selector fast, fritekst scroller */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--ax-space-16)",
              minHeight: 0,
              padding: "8px",
              margin: "-8px",
            }}
          >
            <Select
              label="Velg dokument"
              value={brevMal?.tittel ?? ""}
              onChange={(e) => velgBrevmal(e.target.value)}
              size="medium"
              disabled={erLesevisning}
              style={{ flexShrink: 0 }}
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
                <Heading level="3" size="small" style={{ flexShrink: 0 }}>
                  Fritekstområde
                </Heading>
                <div
                  style={{
                    overflowY: "auto",
                    minHeight: 0,
                    flex: 1,
                    margin: "-8px",
                    padding: "8px",
                  }}
                >
                  <VStack gap="space-16">
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
                  </VStack>
                </div>
              </>
            )}
          </div>

          {/* Høyre kolonne — PDF forhåndsvisning */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: "8px",
              backgroundColor: "#f8f8f8",
              minHeight: 0,
            }}
          >
            {brevMal ? (
              <PdfForhåndsvisning brevmal={brevMal} fritekstbolker={fritekstbolker} />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--ax-text-subtle)",
                }}
              >
                Velg et dokument for å se forhåndsvisning
              </div>
            )}
          </div>
        </div>
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

      <HStack justify="space-between" style={{ flexShrink: 0 }}>
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
    </div>
  );
}
