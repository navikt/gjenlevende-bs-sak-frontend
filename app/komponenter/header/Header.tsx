import React from "react";
import { InternalHeader, Spacer } from "@navikt/ds-react";
import type { Saksbehandler } from "~/server/types";
import { useRouteLoaderData, useNavigate } from "react-router";
import styles from "./Header.module.css";
import { Søkefelt } from "./Søkefelt";
import { SaksbehandlerMenu } from "./SaksbehandlerMenu";
import { useSøk } from "~/hooks/useSøk";
import { useOpprettFagsak } from "~/hooks/useOpprettFagsak";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { søk, søkeresultat, søker, feilmelding, settSøk, clearSøk } = useSøk();
  const { opprettFagsak, oppretter, opprettFeilmelding } = useOpprettFagsak();

  const { saksbehandler, env } =
    useRouteLoaderData<{
      saksbehandler: Saksbehandler | null;
      env: "local" | "development" | "production";
    }>("root") || {};

  const erDev = env !== "production";

  const handleNavigate = (fagsakPersonId: string) => {
    navigate(`/person/${fagsakPersonId}/behandlingsoversikt`);
    clearSøk();
  };

  const handleOpprettFagsak = async () => {
    if (!søkeresultat) return;
    await opprettFagsak(søkeresultat);
    clearSøk();
  };

  return (
    <InternalHeader className={erDev ? styles.devHeader : undefined} data-theme="light">
      <InternalHeader.Title as="a" href="/">
        Gjenlevende BS
      </InternalHeader.Title>
      <Spacer />

      <Søkefelt
        søk={søk}
        onSøkChange={settSøk}
        søker={søker || oppretter}
        feilmelding={feilmelding}
        søkeresultat={søkeresultat}
        onNavigate={handleNavigate}
        onOpprettFagsak={handleOpprettFagsak}
        onClearSøk={clearSøk}
        opprettFeilmelding={opprettFeilmelding}
      />

      <SaksbehandlerMenu saksbehandler={saksbehandler ?? null} />
    </InternalHeader>
  );
};

export default Header;
