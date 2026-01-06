import React from "react";
import { BodyShort, Button, Heading, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/behandlingsoversikt";
import { useOpprettBehandling } from "~/hooks/useOpprettBehandling";


export function meta(_: Route.MetaArgs) {
  return [{ title: "Behandlingsoversikt" }];
}



export default function Behandlingsoversikt() {

  function startOpprettBehandling() {
    opprettBehandling("6d2b3d2c-f42e-421c-a021-c3d76216fa6c_fungerer ikke")
  }

  const { opprettBehandling, opprettFeilmelding } = useOpprettBehandling();

  return (
    <VStack gap="4">
      <Heading level="1" size="large">
        Behandlingsoversikt
      </Heading>

      <Button onClick={startOpprettBehandling}>
        lag behandling på fagsak 6d2b3d2c-f42e-421c-a021-c3d76216fa6c
      </Button>

      <VStack gap="2">
        <BodyShort>{opprettFeilmelding}</BodyShort>
      </VStack>

    </VStack>
  );
}
