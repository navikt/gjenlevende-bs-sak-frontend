import React from "react";
import {Alert, Heading, Loader, VStack} from "@navikt/ds-react";
import type { Route } from "./+types/behandlingsoversikt";
import {useHentBehandlinger} from "~/hooks/useHentBehandlinger";
import {useParams} from "react-router";
import {useFagsak} from "~/hooks/useFagsak";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Behandlingsoversikt" }];
}

export default function Behandlingsoversikt() {
    const { fagsakPersonId } = useParams<{ fagsakPersonId: string }>();
    const {
        fagsak,
        error: fagsakError,
        laster: lasterFagsak,
    } = useFagsak(fagsakPersonId);
    const { behandlinger, error, laster } = useHentBehandlinger(fagsak?.id);

    if (laster || lasterFagsak || !behandlinger) {
        return (
            <div>
                Henter behandlinger...
                <Loader title="Laster..." />
            </div>
        );
    }

    if (fagsakError || error) {
        return (
            <VStack gap="4" style={{ padding: "2rem" }}>
                <Alert variant="error">
                    Kunne ikke hente behandlinger: {error || "Mangler data"}
                </Alert>
            </VStack>
        );
    }

  return (
    <VStack gap="4">
      <Heading level="1" size="large">
        Behandlingsoversikt
      </Heading>
      <VStack>
        {behandlinger.map((b) => (
          <li key={b.id}>
            {b.id} - {b.status} - {b.opprettetAv}
          </li>
        ))}
      </VStack>
    </VStack>
  );
}
