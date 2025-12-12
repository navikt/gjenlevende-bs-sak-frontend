import type {Dokumentinfo} from "~/api/dokument";
import {BodyShort} from "@navikt/ds-react";

export interface Props {
    dokument: Dokumentinfo;
}

export const DokumentListeElement: React.FC<Props> = ({ dokument }) => (
    <>
        <div>
            <BodyShort size="small">{dokument.tittel}</BodyShort>
            <BodyShort size="small">{dokument.dato}</BodyShort>
        </div>
    </>
);
