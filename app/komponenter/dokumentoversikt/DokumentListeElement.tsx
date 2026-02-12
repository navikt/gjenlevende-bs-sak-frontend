import React from "react";
import type { Dokumentinfo } from "~/api/dokument";
import { BodyShort, Label, VStack, HStack } from "@navikt/ds-react";

export interface Props {
  dokument: Dokumentinfo;
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("no-NO");
}

export const DokumentListeElement: React.FC<Props> = ({ dokument }) => (
  <VStack gap="space-1" align="start">
    <Label as="span" size="medium">
      {dokument.tittel}
    </Label>
    <BodyShort size="small" style={{ color: "#666" }}>
      {formatDate(dokument.dato)}
    </BodyShort>
    <HStack gap="space-2"></HStack>
    {dokument.avsenderMottaker?.navn && (
      <BodyShort size="small" style={{ color: "#888" }}>
        Avsender/mottaker: {dokument.avsenderMottaker.navn}
      </BodyShort>
    )}
  </VStack>
);
