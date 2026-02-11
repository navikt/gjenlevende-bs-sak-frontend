import React from "react";
import { Heading, VStack, BodyShort } from "@navikt/ds-react";
import type { Route } from "./+types/personoversikt";
import { usePersonContext } from "~/contexts/PersonContext";
import { formaterNavn } from "~/utils/utils";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Personoversikt` }];
}

export default function PersonOversikt() {
  const { navn, personident } = usePersonContext();
  const visningsNavn = navn ? formaterNavn(navn) : "Navn ikke tilgjengelig";

  return (
    <VStack gap="space-6">
      <Heading level="1" size="large">
        Personoversikt
      </Heading>

      <VStack gap="space-4">
        <BodyShort size="large" weight="semibold">
          {visningsNavn}
        </BodyShort>
        <BodyShort>Personident: {personident || "Ikke tilgjengelig"}</BodyShort>
      </VStack>
    </VStack>
  );
}
