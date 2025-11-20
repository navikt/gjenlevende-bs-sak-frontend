import React, { useEffect, useState } from "react";
import { Heading, Table, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/vedtaksperioderInfotrygd";
import { hentHistorikkForPerson } from "~/api/backend";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Historikk vedtaksperioder Infotrygd" },
    {
      name: "description",
      content: "Oversikt over vedtaksperioder fra Infotrygd",
    },
  ];
}

export default function VedtaksperioderInfotrygd({
  params,
}: Route.ComponentProps) {
  const { fagsakPersonId } = params;
  const [historikk, settHistorikk] = useState<unknown>(null);

  useEffect(() => {
    hentHistorikkForPerson(fagsakPersonId).then((response) => {
      console.log("Response fra backend:", response);
      if (response.data) {
        settHistorikk(response.data);
      } else if (response.error) {
        console.error("Feil fra backend:", response.error, response.melding);
        settHistorikk({ error: response.error, melding: response.melding });
      }
    });
  }, [fagsakPersonId]);

  return (
    <VStack gap="space-4">
      <Heading level="1" size="large" spacing>
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
