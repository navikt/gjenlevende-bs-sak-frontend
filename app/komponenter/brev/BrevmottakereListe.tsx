import type { FC } from "react";
import React from "react";
import { BodyShort, Button, CopyButton, HStack, VStack } from "@navikt/ds-react";
import { type Brevmottaker, useBrevmottaker } from "~/hooks/useBrevmottaker";
import { TrashIcon } from "@navikt/aksel-icons";

export const BrevmottakereListe: FC = () => {
  const { mottakere } = useBrevmottaker();
  const nyMottakerliste: Brevmottaker[] = [];

  return (
    <>
      <BodyShort>Brevmottakere</BodyShort>
      {mottakere.map((mottaker, index) => (
        <HStack
          key={mottaker.personident ?? "" + index}
          style={{ background: "rgba(196, 196, 196, 0.2)" }}
          padding={"2"}
        >
          {/*TODO hent navn til personident under*/}
          <VStack>
            <BodyShort>
              {`${mottaker.personident} (${mottaker.personRolle})`}
              <HStack gap="space-2" align={"center"}>
                <BodyShort size={"small"}>{mottaker.personident}</BodyShort>
                <CopyButton
                  size={"xsmall"}
                  copyText={mottaker.personident ?? ""}
                  variant={"action"}
                  activeText={"kopiert"}
                />
              </HStack>
            </BodyShort>
          </VStack>
          <Button
            variant={"tertiary"}
            onClick={() => {}} //TODO fjern person fra mottakerlisten
            icon={<TrashIcon />}
          ></Button>
        </HStack>
      ))}
      {/*{valgteOrganisasjonMottakere.map((mottaker, index) => (*/}
      {/*  <div key={mottaker.navnHosOrganisasjon + index}>*/}
      {/*    <div>*/}
      {/*      <BodyShort>{`${mottaker.navnHosOrganisasjon}`}</BodyShort>*/}
      {/*      <BodyShort>{`Organisasjonsnummer: ${mottaker.organisasjonsnummer}`}</BodyShort>*/}
      {/*    </div>*/}
      {/*    <Button onClick={() => {}}></Button>*/}
      {/*  </div>*/}
      {/*))}*/}
    </>
  );
};
