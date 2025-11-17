import { Heading, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/vedtaksperioderInfotrygd";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brev" },
    {
      name: "Brev",
      content: "Brevside",
    },
  ];
}

export default function VedtaksperioderInfotrygd() {
  return (
    <VStack gap="space-4">
      <Heading level="1" size="large" spacing>
        Brev
      </Heading>
    </VStack>
  );
}
