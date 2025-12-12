import React from "react";
import type {Dokumentinfo} from "~/api/dokument";
import {DokumentListeElement} from "~/komponenter/dokumentoversikt/DokumentListeElement";

export interface Props {
    dokumenter: Dokumentinfo[];
}

export const Dokumentliste: React.FC<Props> = ({ dokumenter}) => (
    <>
        {dokumenter.map((dokument: Dokumentinfo, indeks: number) => {
            return <DokumentListeElement dokument={dokument} key={indeks} />;
        })}
    </>
);
