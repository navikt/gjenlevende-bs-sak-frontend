import {useParams} from "react-router";
import {Alert, Loader, VStack} from "@navikt/ds-react";
import React from "react";
import {useHentJournalposter} from "~/hooks/useHentJournalposter";

export default function dokumentoversikt() {
    const { fagsakPersonId } = useParams<{ fagsakPersonId: string }>();
    const { journalposter, error, laster } = useHentJournalposter(fagsakPersonId);
    console.log("Hei");
    console.log(journalposter);

    if (laster) {
        return (
            <VStack gap="6" align="center" style={{ padding: "2rem" }}>
        <Loader size="large" title="Henter journalposter..." />
            </VStack>
    );
    }

    if (error || !journalposter || !fagsakPersonId) {
        return (
            <VStack gap="4" style={{ padding: "2rem" }}>
        <Alert variant="error">
            Kunne ikke hente journalposter: {error || "Mangler data"}
        </Alert>
        </VStack>
    );
    }

    return (
    <div>
        <div>{JSON.stringify(journalposter, null, 2)}</div>
    </div>
)
}