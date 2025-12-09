import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/behandlingsoversikt";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Behandlingsoversikt" }];
}

export default function Behandlingsoversikt() {
  return (
    <VStack gap="4">
      <Heading level="1" size="large">
        Behandlingsoversikt
      </Heading>
    </VStack>
  );
}
