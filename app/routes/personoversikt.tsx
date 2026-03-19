import React from "react";
import { Heading, VStack, BodyShort, Button } from "@navikt/ds-react";
import type { Route } from "./+types/personoversikt";
import { usePersonContext } from "~/contexts/PersonContext";
import { formaterNavn } from "~/utils/utils";
import { hentEtterlatteSakIdMedPersonident } from "~/api/etterlatteBehandling";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Personoversikt` }];
}

const GJENNY_URL_DEV = "https://etterlatte-saksbehandling.intern.dev.nav.no";

export default function PersonOversikt() {
  const { personident, person } = usePersonContext();
  const visningsNavn = person?.navn ? formaterNavn(person.navn) : "Navn ikke tilgjengelig";

  const åpnePersonIGjenny = async () => {
    const { data: sak, melding } = await hentEtterlatteSakIdMedPersonident({ fnr: personident! });

    if (!sak) {
      console.error("Klarte ikke hente etterlatte-sak:", melding);
      return;
    }

    const gjennyUrl = GJENNY_URL_DEV;
    window.open(`${gjennyUrl}/person/${sak.sakId}`, "_blank");
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
          <Button onClick={åpnePersonIGjenny}>Åpne personopplysninger i Gjenny</Button>
        </VStack>
      </VStack>
    </VStack>
  );
}
