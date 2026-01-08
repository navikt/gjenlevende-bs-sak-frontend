import React from "react";
import { Outlet, useParams, useMatch } from "react-router";
import { Alert, Loader, VStack } from "@navikt/ds-react";
import { Navbar } from "../komponenter/navbar/Navbar";
import { Side } from "~/komponenter/layout/Side";
import Personheader from "~/komponenter/personheader/Personheader";
import { PersonContext } from "~/contexts/PersonContext";
import { useHentPersonNavn } from "~/hooks/useHentPersonNavn";
import { useFagsak } from "~/hooks/useFagsak";

export default function PersonLayout() {
  const { fagsakPersonId } = useParams<{ fagsakPersonId: string }>();
  const erPåBehandling = useMatch("/person/:fagsakPersonId/behandling/:behandlingId/*");
  const {
    fagsak,
    error: fagsakError,
    melding: fagsakMelding,
    laster: lasterFagsak,
  } = useFagsak(fagsakPersonId);

  const personident = fagsak?.personident;
  const { navn, error: navnError, laster: lasterNavn } = useHentPersonNavn(fagsakPersonId);

  const laster = lasterFagsak || lasterNavn;
  const feil =
    fagsakError ||
    (!fagsakPersonId ? "Mangler fagsakPersonId" : null) ||
    (!personident ? "Fant ikke personident for fagsaken" : null);

  if (laster) {
    return (
      <VStack gap="6" align="center" style={{ padding: "2rem" }}>
        <Loader size="large" title="Henter personinformasjon..." />
      </VStack>
    );
  }

  if (feil || !fagsakPersonId || !personident) {
    return (
      <VStack gap="4" style={{ padding: "2rem" }}>
        <Alert variant="error">
          Kunne ikke hente personinformasjon: {feil || "Mangler data"}
          {fagsakMelding && <p>{fagsakMelding}</p>}
        </Alert>
      </VStack>
    );
  }

  return (
    <PersonContext.Provider
      value={{
        navn: navn,
        personident,
        fagsakPersonId,
        laster: lasterNavn,
        error: navnError,
      }}
    >
      <Personheader />
      {!erPåBehandling ? (
        <>
          <Navbar />
          <Side>
            <Outlet />
          </Side>
        </>
      ) : (
        <Outlet />
      )}
    </PersonContext.Provider>
  );
}
