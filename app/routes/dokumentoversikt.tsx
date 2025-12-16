import {useParams} from "react-router";
import {Alert, Loader, VStack} from "@navikt/ds-react";
import React from "react";
import {useHentDokumenter} from "~/hooks/useHentDokumenter";
import {Dokumentliste} from "~/komponenter/dokumentoversikt/Dokumentliste";

export default function dokumentoversikt() {
    const { fagsakPersonId } = useParams<{ fagsakPersonId: string }>();
    const { dokumenter, error, laster } = useHentDokumenter(fagsakPersonId);

    if (laster) {
        return (
            <div>
                Henter dokumenter...
                <Loader title="Laster..." />
            </div>
        );
    }

    if (error || !dokumenter || !fagsakPersonId) {
        return (
            <VStack gap="4" style={{ padding: "2rem" }}>
                <Alert variant="error">
                    Kunne ikke hente dokumenter: {error || "Mangler data"}
                </Alert>
            </VStack>
        );
    }
    return (
        <VStack>
            <Dokumentliste dokumenter={dokumenter} />
        </VStack>
    )
}