import React from "react";
import { Outlet, useParams } from "react-router";
import { Alert, Loader, VStack } from "@navikt/ds-react";
import Navbar from "../komponenter/navbar/Navbar";
import { Side } from "~/komponenter/layout/Side";
import Personheader from "~/komponenter/personheader/Personheader";
import { PersonContext } from "~/contexts/PersonContext";
import { useHentPersonNavn } from "~/hooks/useHentPersonNavn";

export default function PersonLayout() {
  const { fagsakPersonId } = useParams<{ fagsakPersonId: string }>();
  const { navn, error, laster } = useHentPersonNavn(fagsakPersonId);

  if (laster) {
    return (
      <VStack gap="6" align="center" style={{ padding: "2rem" }}>
        <Loader size="large" title="Henter personinformasjon..." />
      </VStack>
    );
  }

  if (error || !navn || !fagsakPersonId) {
    return (
      <VStack gap="4" style={{ padding: "2rem" }}>
        <Alert variant="error">
          Kunne ikke hente personin: {error || "Mangler data"}
        </Alert>
      </VStack>
    );
  }

  return (
    <PersonContext.Provider
      value={{ navn, fødselsnummer: fagsakPersonId, laster, error }}
    >
      <Personheader />
      <Navbar />
      <Side>
        <Outlet />
      </Side>
    </PersonContext.Provider>
  );
}
