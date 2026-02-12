import React from "react";
import type {Beløpsperioder} from "~/komponenter/behandling/vedtak/vedtak";
import {Table} from "@navikt/ds-react";


export const BeregningBarnetilsynTabell: React.FC<{ beløpsperioder: Beløpsperioder }> = ({beløpsperioder}) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Antall barn</Table.HeaderCell>
                    <Table.HeaderCell>Utgifter</Table.HeaderCell>
                    <Table.HeaderCell>Stønadsbeløp pr mnd</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {beløpsperioder.map((periode, idx) => (
                    <Table.Row key={idx}>
                        <Table.DataCell>{periode.datoFra} - {periode.datoTil}</Table.DataCell>
                        <Table.DataCell>{periode.antallBarn}</Table.DataCell>
                        <Table.DataCell>{periode.utgifter}</Table.DataCell>
                        <Table.DataCell>{periode.beløp}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}