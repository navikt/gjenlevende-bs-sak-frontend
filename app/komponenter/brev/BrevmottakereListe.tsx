import type { FC } from "react";
import React from "react";
import { BodyShort, Button, CopyButton, HStack, VStack } from "@navikt/ds-react";
import type { Brevmottaker } from "~/hooks/useBrevmottaker";
import { TrashIcon } from "@navikt/aksel-icons";

interface Props {
  mottakere: Brevmottaker[];
}

export const BrevmottakereListe: FC<Props> = ({ mottakere }) => {
  // const nyMottakerliste: Brevmottaker[] = [];

  return (
    <VStack gap={"2"} width={"100%"}>
      <BodyShort>Brevmottakere</BodyShort>
      {mottakere.map((mottaker, index) => {
        if (mottaker.mottakerType === "ORGANISASJON") {
          return (
            <HStack
              key={mottaker.orgnr ?? "" + index}
              style={{ background: "rgba(196, 196, 196, 0.2)" }}
              padding={"2"}
            >
              <VStack>
                <BodyShort>{`${mottaker.orgnr} v/ ${mottaker.navnHosOrganisasjon} (${mottaker.personRolle})`}</BodyShort>
                <HStack gap="space-2" align={"center"}>
                  <BodyShort size={"small"}>{mottaker.orgnr}</BodyShort>
                  <CopyButton
                    size={"xsmall"}
                    copyText={mottaker.personident ?? ""}
                    variant={"action"}
                    activeText={"kopiert"}
                  />
                </HStack>
              </VStack>
              <Button
                variant={"tertiary"}
                onClick={() => {}} //TODO fjern person fra mottakerlisten
                icon={<TrashIcon />}
              ></Button>
            </HStack>
          );
        } else {
          return (
            <HStack
              key={mottaker.personident}
              style={{ background: "rgba(196, 196, 196, 0.2)" }}
              padding={"2"}
            >
              <VStack>
                <BodyShort>{`${mottaker.personident} (${mottaker.personRolle})`}</BodyShort>
                <HStack gap="space-2" align={"center"}>
                  <BodyShort size={"small"}>{mottaker.personident}</BodyShort>
                  <CopyButton
                    size={"xsmall"}
                    copyText={mottaker.personident ?? ""}
                    variant={"action"}
                    activeText={"kopiert"}
                  />
                </HStack>
              </VStack>
              <Button
                variant={"tertiary"}
                onClick={() => {}} //TODO fjern person fra mottakerlisten
                icon={<TrashIcon />}
              ></Button>
            </HStack>
          );
        }
      })}
    </VStack>
  );
};
