import { Heading, BodyShort, Button, VStack } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import type { Route } from "./+types/landingsside";
import type { Saksbehandler } from "~/server/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Landingsside" },
    {
      name: "description",
      content:
        "Landingsside for saksbehandling av gjenlevende barnetilsyn og skolepenger",
    },
  ];
}

export default function Landingsside() {
  const { saksbehandler } =
    useRouteLoaderData<{ saksbehandler: Saksbehandler | null }>("root") || {};

  return (
    <VStack gap="8">
      <Heading level="1" size="large" spacing>
        Gjenlevende barnetilsyn og skolepenger
      </Heading>

      {saksbehandler && (
        <VStack gap="4">
          <BodyShort spacing>
            Velkommen, {saksbehandler.navn || saksbehandler.brukernavn}!
          </BodyShort>
        </VStack>
      )}
    </VStack>
  );
}
