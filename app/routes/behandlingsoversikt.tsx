import React, {forwardRef} from "react";
import {BodyShort, Button, Alert, Heading, Loader, VStack, Table, type DataCellProps} from "@navikt/ds-react";
import type { Route } from "./+types/behandlingsoversikt";
import {useHentBehandlinger} from "~/hooks/useHentBehandlinger";
import {useParams} from "react-router";
import {useFagsak} from "~/hooks/useFagsak";
import { useOpprettBehandling } from "~/hooks/useOpprettBehandling";
import { useNavigate } from "react-router";
import {formaterIsoDatoTid, formatterEnumVerdi} from "~/utils/utils";


export function meta(_: Route.MetaArgs) {
  return [{ title: "Behandlingsoversikt" }];
}

export const TableDataCellSmall = forwardRef<HTMLTableCellElement, DataCellProps>((props, ref) => (
    <Table.DataCell textSize={'small'} {...props} ref={ref} />
));
TableDataCellSmall.displayName = 'TableDataCellSmall';

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
        <Table.Body>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Behandling opprettetdato</Table.HeaderCell>
                        <Table.HeaderCell>Opprettet av</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {behandlinger.map((behandling) => (
                        <Table.Row key={behandling.id}>
                            <TableDataCellSmall>
                                {formaterIsoDatoTid(behandling.opprettet)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {behandling.opprettetAv}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                {formatterEnumVerdi(behandling.status)}
                            </TableDataCellSmall>
                            <TableDataCellSmall>
                                <Button size={"small"} onClick={() => gåTilBehandling(behandling.id)}>Gå til behandling</Button>
                            </TableDataCellSmall>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Table.Body>
        <div>
          <Button onClick={startOpprettBehandling}>
            Lag behandling
          </Button>
            <BodyShort>{opprettFeilmelding}</BodyShort>

        </div>
    </VStack>
  );
}
