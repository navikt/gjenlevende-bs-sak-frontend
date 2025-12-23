import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/brev";
import { BrevSide } from "~/komponenter/brev/BrevSide";

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
      <Heading level="1" size="medium">
        Brevmottaker:
        {/*  TODO legge til mulighet for å endre brevmottaker*/}
      </Heading>
      <BrevSide />
    </VStack>
  );
}
