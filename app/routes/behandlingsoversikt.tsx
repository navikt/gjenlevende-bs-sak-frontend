import React from "react";
import {BodyShort, Button, Alert, Heading, Loader, VStack} from "@navikt/ds-react";
import type { Route } from "./+types/behandlingsoversikt";
import {useHentBehandlinger} from "~/hooks/useHentBehandlinger";
import {useParams} from "react-router";
import {useFagsak} from "~/hooks/useFagsak";
import { useOpprettBehandling } from "~/hooks/useOpprettBehandling";
import { useNavigate } from "react-router";
import {formaterIsoDatoTidMedSekunder} from "~/utils/utils";


export function meta(_: Route.MetaArgs) {
  return [{ title: "Behandlingsoversikt" }];
}

export default function Behandlingsoversikt() {
    const { fagsakPersonId } = useParams<{ fagsakPersonId: string }>();
    const navigate = useNavigate();
    const {
        fagsak,
        error: fagsakError,
        laster: lasterFagsak,
    } = useFagsak(fagsakPersonId);
    const { behandlinger, error, laster } = useHentBehandlinger(fagsak?.id);

  const { opprettBehandling, opprettFeilmelding } = useOpprettBehandling();

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

  async function startOpprettBehandling() {
    if(fagsak){
      const behandlingId = await opprettBehandling(fagsak.id);
      if (behandlingId) {
          gåTilBehandling(behandlingId);
      }
    }
  }

  function gåTilBehandling(behandlingId: string) {
    navigate(`/person/${fagsakPersonId}/behandling/${behandlingId}/inngangsvilkar`);
  }

  return (
    <VStack gap="4">
      <Heading level="1" size="large">
        Behandlingsoversikt
      </Heading>
      <VStack>
        {behandlinger.map((behandling) => (
          <li key={behandling.id}>
            {formaterIsoDatoTidMedSekunder(behandling.opprettet)} - {behandling.status} - {behandling.opprettetAv} <Button size="small" onClick={() => gåTilBehandling(behandling.id)}>Gå til behandling</Button>
          </li>
        ))}
      </VStack>

      <Button onClick={startOpprettBehandling}>
        Lag behandling
      </Button>

      <VStack gap="2">
        <BodyShort>{opprettFeilmelding}</BodyShort>
      </VStack>

    </VStack>
  );
}
