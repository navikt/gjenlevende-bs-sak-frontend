import { Box, Button, Heading, HGrid, Select, VStack } from "@navikt/ds-react";
import React from "react";
import { Fritekstbolk } from "~/komponenter/brev/Fritekstbolk";
import { PlusIcon } from "@navikt/aksel-icons";
import { PdfForhåndsvisning } from "~/komponenter/brev/PdfForhåndsvisning";
import { brevmaler } from "~/komponenter/brev/brevmaler";
import { useBrev } from "~/komponenter/brev/useBrev";

export const BrevSide = () => {
  const {
    brevMal,
    fritekstbolker,
    leggTilFritekstbolk,
    flyttBolkOpp,
    flyttBolkNed,
    oppdaterFelt,
    velgBrevmal,
    sendPdfTilSak,
  } = useBrev();

  return (
    <HGrid gap="32" columns={2} width={"100%"}>
      <Box
        style={{ backgroundColor: "white", alignSelf: "flex-start" }}
        borderRadius="small"
        padding={"space-16"}
      >
        <VStack gap={"4"}>
          <Select
            label="Velg dokument"
            value={brevMal?.tittel ?? ""}
            onChange={(e) => {
              velgBrevmal(e.target.value);
            }}
            size={"small"}
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
            <VStack gap={"2"}>
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
                  fritekstfeltListe={fritekstbolker}
                />
              ))}
              <Button
                variant={"secondary"}
                icon={<PlusIcon title={"Legg til fritekstfelt"} />}
                onClick={leggTilFritekstbolk}
                size={"small"}
              >
                Legg til fritekstfelt
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
      <Box>
        <VStack gap={"4"} align={"center"}>
          <PdfForhåndsvisning brevmal={brevMal} fritekstbolker={fritekstbolker} />
          {brevMal &&
            fritekstbolker && ( //TODO undersøke om det er noen maler som ikke har fritekstbolker. Isåfall kun {brevmal &&
              <Button
                style={{ width: "fit-content" }}
                onClick={() => sendPdfTilSak(brevMal, fritekstbolker)}
              >
                Send pdf til sak{" "}
              </Button>
            )}
          {/* //TODO Knappen over skal bli "Send til beslutter" etterhvert*/}
        </VStack>
      </Box>
    </HGrid>
  );
};
