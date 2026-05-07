import React from "react";
import { Table } from "@navikt/ds-react";
import type { SimuleringResultat } from "~/routes/behandling/simulering";

export const SimuleringTabell: React.FC<{ resultat: SimuleringResultat }> = ({ resultat }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          {resultat.perioder.map((periode) => (
            <Table.HeaderCell key={periode.fom}>{periode.fom}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell>Tidligere utbetalt</Table.HeaderCell>
          {resultat.perioder.map((periode) => (
            <Table.DataCell key={periode.fom}>
              {periode.utbetalinger.reduce((sum, u) => sum + u.tidligereUtbetalt, 0)}
            </Table.DataCell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell>Nytt beløp</Table.HeaderCell>
          {resultat.perioder.map((periode) => (
            <Table.DataCell key={periode.fom}>
              {periode.utbetalinger.reduce((sum, u) => sum + u.nyttBeløp, 0)}
            </Table.DataCell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell>Differanse</Table.HeaderCell>
          {resultat.perioder.map((periode) => {
            const tidligereUtbetalt = periode.utbetalinger.reduce((sum, u) => sum + u.tidligereUtbetalt, 0);
            const nyttBeløp = periode.utbetalinger.reduce((sum, u) => sum + u.nyttBeløp, 0);
            const differanse = nyttBeløp - tidligereUtbetalt;
            return (
              <Table.DataCell key={periode.fom}>
                {differanse !== 0 && (
                  <span style={{ color: differanse > 0 ? "var(--a-green-600)" : "var(--a-red-500)" }}>
                    {differanse}
                  </span>
                )}
              </Table.DataCell>
            );
          })}
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
