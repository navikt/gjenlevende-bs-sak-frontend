import { Box, Button, Heading, HGrid, Select, VStack } from "@navikt/ds-react";
import React, { useState } from "react";
import { Fritekstbolk } from "~/komponenter/brev/Fritekstbolk";
import { PlusIcon } from "@navikt/aksel-icons";
import { PdfForhåndsvisning } from "~/komponenter/brev/PdfForhåndsvisning";
import { apiCall, type ApiResponse } from "~/api/backend";
import { brevmaler } from "~/komponenter/brev/brevmaler";
import type { Brevmal, Tekstbolk } from "~/komponenter/brev/typer";

export const BrevSide = () => {
  const [brevMal, settBrevmal] = useState<Brevmal | null>(null);
  const [fritekstbolker, settFritekstbolker] = useState<Tekstbolk[]>([]);

  const leggTilFritekstbolk = () => {
    settFritekstbolker((prev) => [...prev, { underoverskrift: "", innhold: "" }]);
  };

  const flyttBolkOpp = (index: number) => {
    settFritekstbolker((prev) => {
      if (index === 0) return prev;
      const newArr = [...prev];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      return newArr;
    });
  };

  const flyttBolkNed = (index: number) => {
    settFritekstbolker((prev) => {
      if (index === prev.length - 1) return prev;
      const newArr = [...prev];
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  const oppdaterFelt = (index: number, partial: Partial<Tekstbolk>) => {
    settFritekstbolker((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], ...partial };
      return newArr;
    });
  };

  const velgBrevmal = (brevmal: string): void => {
    if (brevmal === "") {
      settBrevmal(null);
    } else {
      const valgtBrevmal = brevmaler.find((b) => b.tittel === brevmal) ?? null;
      settBrevmal(valgtBrevmal);
    }
  };

  const sendPdfTilSak = async (
    brevmal: Brevmal,
    fritekstbolker: Tekstbolk[]
  ): Promise<ApiResponse<unknown>> => {
    return apiCall(`/brev/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brevmal,
        fritekstbolker,
      }),
    });
  };

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
                  deltittel={fritekstfelt.underoverskrift}
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
