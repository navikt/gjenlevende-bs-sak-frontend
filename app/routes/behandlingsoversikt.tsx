import React, { forwardRef } from "react";
import {
  BodyShort,
  Button,
  Heading,
  Loader,
  VStack,
  Table,
  type DataCellProps,
} from "@navikt/ds-react";
import type { Route } from "./+types/behandlingsoversikt";
import { useHentBehandlinger } from "~/hooks/useHentBehandlinger";
import { useParams } from "react-router";
import { usePersonContext } from "~/contexts/PersonContext";
import { useOpprettBehandling } from "~/hooks/useOpprettBehandling";
import { useNavigate } from "react-router";
import { formaterIsoDatoTid, formatterEnumVerdi } from "~/utils/utils";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Behandlingsoversikt" }];
}

export const TableDataCellSmall = forwardRef<HTMLTableCellElement, DataCellProps>((props, ref) => (
  <Table.DataCell textSize={"small"} {...props} ref={ref} />
));
TableDataCellSmall.displayName = "TableDataCellSmall";

export const Behandlingsoversikt = () => {
  const { fagsakPersonId } = useParams<{ fagsakPersonId: string }>();
  const navigate = useNavigate();
  const { fagsak, fagsakId } = usePersonContext();
  const { behandlinger, laster } = useHentBehandlinger(fagsakId);

  const { opprettBehandling, opprettFeilmelding } = useOpprettBehandling();

  if (laster || !behandlinger || !fagsak) {
    return (
      <div>
        Henter data...
        <Loader title="Laster..." />
      </div>
    );
  }

  const startOpprettBehandling = async () => {
    if (fagsak) {
      const behandlingId = await opprettBehandling(fagsak.id);
      if (behandlingId) {
        gåTilBehandling(behandlingId);
      }
    }
  };

  const gåTilBehandling = (behandlingId: string) => {
    navigate(`/person/${fagsakPersonId}/behandling/${behandlingId}/arsak-behandling`);
  };

  return (
    <VStack gap="4">
      <Heading level="1" size="large">
        Behandlingsoversikt
      </Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Behandling opprettetdato</Table.HeaderCell>
            <Table.HeaderCell>Opprettet av</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Resultat</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {behandlinger.map((behandling) => (
            <Table.Row key={behandling.id}>
              <TableDataCellSmall>{formaterIsoDatoTid(behandling.opprettet)}</TableDataCellSmall>
              <TableDataCellSmall>{behandling.opprettetAv}</TableDataCellSmall>
              <TableDataCellSmall>{formatterEnumVerdi(behandling.status)}</TableDataCellSmall>
              <TableDataCellSmall>{formatterEnumVerdi(behandling.resultat)}</TableDataCellSmall>
              <TableDataCellSmall>
                <Button size={"small"} onClick={() => gåTilBehandling(behandling.id)}>
                  Gå til behandling
                </Button>
              </TableDataCellSmall>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <div>
        <Button onClick={startOpprettBehandling}>Lag behandling</Button>
        <BodyShort>{opprettFeilmelding}</BodyShort>
      </div>
    </VStack>
  );
};
