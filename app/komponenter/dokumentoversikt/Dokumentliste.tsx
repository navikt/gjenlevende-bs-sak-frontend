import React from "react";
import type { Dokumentinfo } from "~/api/dokument";
import { DokumentListeElement } from "~/komponenter/dokumentoversikt/DokumentListeElement";
import { VStack, Heading } from "@navikt/ds-react";

export interface Props {
  dokumenter: Dokumentinfo[];
}

export const Dokumentliste: React.FC<Props> = ({ dokumenter }) => (
  <VStack gap="space-4" align="stretch">
    <Heading size="small" level="3" spacing>
      Dokumenter
    </Heading>
    {dokumenter.length === 0 ? (
      <span>Ingen dokumenter funnet.</span>
    ) : (
      dokumenter.map((dokument: Dokumentinfo, indeks: number) => (
        <React.Fragment key={indeks}>
          <DokumentListeElement dokument={dokument} />
          {indeks < dokumenter.length - 1 && (
            <hr style={{ border: "1px solid #eee", margin: "0.5rem 0" }} />
          )}
        </React.Fragment>
      ))
    )}
  </VStack>
);
