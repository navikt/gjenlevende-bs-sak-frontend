import type { FC } from "react";
import React from "react";
import { BodyShort, Button, CopyButton, HStack, VStack } from "@navikt/ds-react";
import { type Brevmottaker, MottakerType } from "~/hooks/useBrevmottaker";
import { TrashIcon } from "@navikt/aksel-icons";

interface Props {
  mottakere: Brevmottaker[];
  fjernMottaker: (index: number) => void;
}

export const BrevmottakereListe: FC<Props> = ({ mottakere, fjernMottaker }) => {
  return (
    <VStack gap={"space-2"} width={"100%"}>
      <BodyShort>Brevmottakere</BodyShort>
      {mottakere.map((mottaker, index) => {
        const erOrganisasjon = mottaker.mottakerType === MottakerType.ORGANISASJON;
        const orgNrEllerPersonIdent = erOrganisasjon ? mottaker.orgnr : mottaker.personident;

        return (
          <HStack key={index} style={{ background: "var(--a-surface-subtle)" }} padding={"space-2"}>
            <VStack>
              <BodyShort>
                {erOrganisasjon
                  ? `${mottaker.orgnr} v/ ${mottaker.navnHosOrganisasjon} (${mottaker.personRolle})`
                  : `${mottaker.personident} (${mottaker.personRolle})`}
              </BodyShort>
              <HStack gap="space-2" align={"center"}>
                <BodyShort size={"small"}>{orgNrEllerPersonIdent}</BodyShort>
                <CopyButton
                  size={"xsmall"}
                  copyText={orgNrEllerPersonIdent!}
                  variant={"action"}
                  activeText={"kopiert"}
                />
              </HStack>
            </VStack>
            <Button
              variant={"tertiary"}
              onClick={() => fjernMottaker(index)}
              icon={<TrashIcon />}
            ></Button>
          </HStack>
        );
      })}
    </VStack>
  );
};
