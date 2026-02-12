import { Box, Button, Heading, HGrid, Select, VStack } from "@navikt/ds-react";
import React, { useEffect } from "react";
import { Fritekstbolk } from "~/komponenter/brev/Fritekstbolk";
import { PlusIcon } from "@navikt/aksel-icons";
import { PdfForhåndsvisning } from "~/komponenter/brev/PdfForhåndsvisning";
import { brevmaler } from "~/komponenter/brev/brevmaler";
import { useBrev } from "~/komponenter/brev/useBrev";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useErLesevisning } from "~/hooks/useErLesevisning";
import { useBeslutter } from "~/hooks/useBeslutter";

export const BrevSide = () => {
  const erLesevisning = useErLesevisning();

  const { behandlingId, revaliderBehandling } = useBehandlingContext();
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

  const { sender: senderTilBeslutter, sendTilBeslutter, angreSendTilBeslutter } = useBeslutter();

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
      revaliderBehandling();
    }
  };

  const handleAngreSendTilBeslutter = async () => {
    const respons = await angreSendTilBeslutter(behandlingId);
    if (respons.data) {
      revaliderBehandling();
    }
  };

  return (
    <HGrid gap="space-32" columns={2} width={"100%"}>
      <Box
        style={{ backgroundColor: "white", alignSelf: "flex-start" }}
        borderRadius="2"
        padding={"space-16"}
      >
        <VStack gap={"space-4"}>
          <Select
            label="Velg dokument"
            value={brevMal?.tittel ?? ""}
            onChange={(e) => {
              velgBrevmal(e.target.value);
            }}
            size={"small"}
            disabled={erLesevisning}
          >
            <option value="" disabled>
              Ikke valgt
            </option>
            {brevmaler.map((brevmal) => (
              <option key={brevmal.tittel} value={brevmal.tittel}>
                {brevmal.tittel}
              </option>
            ))}
          </Select>
          {brevMal && (
            <VStack gap={"space-2"}>
              <Heading level={"3"} size={"small"} spacing>
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
                variant={"secondary"}
                icon={<PlusIcon title={"Legg til fritekstfelt"} />}
                onClick={leggTilFritekstbolk}
                size={"small"}
                disabled={erLesevisning}
              >
                Legg til fritekstfelt
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
      <Box>
        <VStack gap={"space-4"} align={"center"}>
          <PdfForhåndsvisning brevmal={brevMal} fritekstbolker={fritekstbolker} />
          {brevMal && fritekstbolker && (
            <Button
              style={{ width: "fit-content" }}
              onClick={() => sendPdfTilSak(behandlingId, brevMal, fritekstbolker)}
              disabled={sender || erLesevisning}
            >
              Send pdf til sak{" "}
            </Button>
          )}

          {brevMal && fritekstbolker && (
            <>
              <Button
                onClick={handleSendTilBeslutter}
                disabled={senderTilBeslutter || erLesevisning}
              >
                Send til beslutter
              </Button>

              <Button onClick={handleAngreSendTilBeslutter}>Angre send til beslutter</Button>
            </>
          )}
        </VStack>
      </Box>
    </HGrid>
  );
};
