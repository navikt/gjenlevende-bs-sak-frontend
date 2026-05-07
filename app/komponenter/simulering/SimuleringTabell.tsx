import React from "react";
import { Table } from "@navikt/ds-react";
import type { SimuleringResultat } from "~/routes/behandling/simulering";

export const SimuleringTabell: React.FC<{ resultat: SimuleringResultat }> = ({ resultat }) => {
  const periodeData = resultat.perioder.map((periode) => {
    const tidligereUtbetalt = periode.utbetalinger.reduce((sum, u) => sum + u.tidligereUtbetalt, 0);
    const nyttBeløp = periode.utbetalinger.reduce((sum, u) => sum + u.nyttBeløp, 0);
    return { fom: periode.fom, tidligereUtbetalt, nyttBeløp, differanse: nyttBeløp - tidligereUtbetalt };
  });

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          {periodeData.map((p) => (
            <Table.HeaderCell key={p.fom}>{p.fom}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell>Tidligere utbetalt</Table.HeaderCell>
          {periodeData.map((p) => (
            <Table.DataCell key={p.fom}>{p.tidligereUtbetalt}</Table.DataCell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell>Nytt beløp</Table.HeaderCell>
          {periodeData.map((p) => (
            <Table.DataCell key={p.fom}>{p.nyttBeløp}</Table.DataCell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell>Differanse</Table.HeaderCell>
          {periodeData.map((p) => (
            <Table.DataCell key={p.fom}>
              {p.differanse !== 0 && (
                <span style={{ color: p.differanse > 0 ? "var(--a-green-600)" : "var(--a-red-500)" }}>
                  {p.differanse}
                </span>
              )}
            </Table.DataCell>
          ))}
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
