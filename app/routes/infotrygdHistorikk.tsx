import React from "react";
import { Alert, Heading, Loader, Table, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/infotrygdHistorikk";
import { useHentInfotrygdHistorikk } from "~/hooks/useHentInfotrygdHistorikk";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Historikk i Infotrygd" },
    {
      name: "description",
      content: "Oversikt over historikk fra Infotrygd",
    },
  ];
}

export default function InfotrygdHistorikk({ params }: Route.ComponentProps) {
  const { fagsakPersonId } = params;
  const state = useHentInfotrygdHistorikk(fagsakPersonId);
  const { data: historikk, laster, feil, melding } = state;

  if (laster) {
    return (
      <div>
        Laster historikk fra Infotrygd...
        <Loader title="Laster..." />
      </div>
    );
  }

  if (feil) {
    return (
      <Alert variant="error">
        <Heading level="2" size="small" spacing>
          {feil}
        </Heading>
        {melding && <p>{melding}</p>}
      </Alert>
    );
  }

  return (
    <VStack gap="space-4">
      <Heading level="1" size="medium" spacing>
        Historikk i infotrygd for personident: {fagsakPersonId}
      </Heading>

      <Table>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(historikk, null, 2)}
        </pre>
      </Table>
    </VStack>
  );
}
