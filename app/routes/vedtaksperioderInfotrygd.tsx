import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/vedtaksperioderInfotrygd";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Historikk vedtaksperioder Infotrygd" },
    {
      name: "description",
      content: "Oversikt over vedtaksperioder fra Infotrygd",
    },
  ];
}

export default function VedtaksperioderInfotrygd() {
  return (
    <VStack gap="space-4">
      <Heading level="1" size="large" spacing>
        Historikk vedtaksperioder Infotrygd
      </Heading>
    </VStack>
  );
}
