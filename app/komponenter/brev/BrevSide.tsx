import { Button, Heading, HGrid, HStack, Select, VStack } from "@navikt/ds-react";
import React, { useEffect } from "react";
import { Fritekstbolk } from "~/komponenter/brev/Fritekstbolk";
import { PlusIcon } from "@navikt/aksel-icons";
import { PdfForhåndsvisning } from "~/komponenter/brev/PdfForhåndsvisning";
import { brevmaler } from "~/komponenter/brev/brevmaler";
import { useBrev } from "~/komponenter/brev/useBrev";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useErLesevisning } from "~/hooks/useErLesevisning";
import { useBeslutter } from "~/hooks/useBeslutter";
import { oppdaterEndringshistorikk } from "~/utils/endringshistorikkEvent";

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

  const { sender: senderTilBeslutter, sendTilBeslutter } = useBeslutter();

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
    <HGrid gap="space-8" columns={2} width={"100%"}>
      <div style={{ alignSelf: "flex-start" }}>
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
                variant={"tertiary"}
                icon={<PlusIcon title={"Legg til fritekstfelt"} />}
                onClick={leggTilFritekstbolk}
                disabled={erLesevisning}
                style={{ width: "100%" }}
              >
                Legg til fritekstfelt
              </Button>
            </VStack>
          )}
        </VStack>
      </div>
      <div>
        <VStack gap={"space-16"} align={"center"}>
          <PdfForhåndsvisning brevmal={brevMal} fritekstbolker={fritekstbolker} />
          {brevMal && fritekstbolker && (
            <HStack gap="space-16" paddingBlock="space-4 space-0">
              <Button
                variant="secondary"
                onClick={() => sendPdfTilSak(behandlingId, brevMal, fritekstbolker)}
                disabled={sender || erLesevisning}
              >
                Send pdf til sak
              </Button>
              <Button
                onClick={handleSendTilBeslutter}
                disabled={senderTilBeslutter || erLesevisning}
              >
                Send til beslutter
              </Button>
            </HStack>
          )}
        </VStack>
      </div>
    </HGrid>
  );
};
