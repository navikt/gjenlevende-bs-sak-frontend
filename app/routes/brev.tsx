import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/brev";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Brev" },
    {
      name: "Brev",
      content: "Brevside",
    },
  ];
}

export default function Brev() {
  return (
    <VStack gap="space-4">
      <Heading level="1" size="large" spacing>
        Brev
      </Heading>
    </VStack>
  );
}
