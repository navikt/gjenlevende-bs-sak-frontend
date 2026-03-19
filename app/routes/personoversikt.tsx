import React from "react";
import { Heading, VStack, BodyShort, Button } from "@navikt/ds-react";
import type { Route } from "./+types/personoversikt";
import { usePersonContext } from "~/contexts/PersonContext";
import { formaterNavn } from "~/utils/utils";
import { hentSakForPerson } from "~/api/etterlatteBehandling";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Personoversikt` }];
}

export default function PersonOversikt() {
  const { personident, person } = usePersonContext();
  const visningsNavn = person?.navn ? formaterNavn(person.navn) : "Navn ikke tilgjengelig";
  const hentEtterlatteOmstillingsstønadPersonopplysning = () => {
    // TODO: skal lage lenke
    hentSakForPerson({ fnr: personident, type: "OMSTILLINGSSTOENAD" })
      .then((sak) => {
        console.log("Sak for omstillingsstønad:", sak);
      })
      .catch((error) => {
        console.error("Feil ved henting av sak for omstillingsstønad:", error);
      });
  };

  return (
    <VStack gap="space-6">
      <Heading level="1" size="large">
        Personoversikt
      </Heading>

      <VStack gap="space-4">
        <VStack gap="space-4">
          <BodyShort size="large" weight="semibold">
            {visningsNavn}
          </BodyShort>
          <BodyShort>Personident: {personident || "Ikke tilgjengelig"}</BodyShort>
          <Button onClick={hentEtterlatteOmstillingsstønadPersonopplysning}>
            Hent sak for omstillingsstønad
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
}
