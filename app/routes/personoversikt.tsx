import React from "react";
import { Heading, VStack, BodyShort } from "@navikt/ds-react";
import type { Route } from "./+types/personoversikt";
import { usePersonContext } from "~/contexts/PersonContext";
import { formaterNavn } from "~/utils/utils";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Personoversikt` }];
}

export default function PersonOversikt() {
  const { navn, fødselsnummer } = usePersonContext();

  return (
    <VStack gap="6">
      <Heading level="1" size="large">
        Personoversikt
      </Heading>

      <VStack gap="4">
        <BodyShort size="large" weight="semibold">
          {formaterNavn(navn)}
        </BodyShort>
        <BodyShort>Fødselsnummer: {fødselsnummer}</BodyShort>
      </VStack>
    </VStack>
  );
}
