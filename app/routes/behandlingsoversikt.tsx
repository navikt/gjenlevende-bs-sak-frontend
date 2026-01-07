import React from "react";
import {BodyShort, Button, Alert, Heading, Loader, VStack} from "@navikt/ds-react";
import type { Route } from "./+types/behandlingsoversikt";
import {useHentBehandlinger} from "~/hooks/useHentBehandlinger";
import {useParams} from "react-router";
import {useFagsak} from "~/hooks/useFagsak";
import { useOpprettBehandling } from "~/hooks/useOpprettBehandling";


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

  const { opprettBehandling, opprettFeilmelding } = useOpprettBehandling();

  console.log("OPPRETTET BEHANDLING: ")


  if (laster || lasterFagsak || !behandlinger || !fagsak ) {
        return (
            <div>
                Henter data...
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

  function startOpprettBehandling() {
    if(fagsak){
      opprettBehandling(fagsak.id)
    }
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

      <Button onClick={startOpprettBehandling}>
        lag behandling på fagsak 6d2b3d2c-f42e-421c-a021-c3d76216fa6c
      </Button>

      <VStack gap="2">
        <BodyShort>{opprettFeilmelding}</BodyShort>
      </VStack>

    </VStack>
  );
}
