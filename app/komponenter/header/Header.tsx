import React, { useState } from "react";
import { LeaveIcon } from "@navikt/aksel-icons";
import {
  BodyShort,
  Detail,
  Dropdown,
  HStack,
  InternalHeader,
  Search,
  Spacer,
  VStack,
} from "@navikt/ds-react";
import type { Saksbehandler } from "~/server/types";
import { useRouteLoaderData, useNavigate } from "react-router";
import styles from "./Header.module.css";
import { hentEllerOpprettFagsak } from "~/api/backend";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [søk, settSøk] = useState<string>("");
  const [søker, settSøker] = useState(false);
  const [feilmelding, settFeilmelding] = useState<string | null>(null);

  const { saksbehandler, env } =
    useRouteLoaderData<{
      saksbehandler: Saksbehandler | null;
      env: "local" | "development" | "production";
    }>("root") || {};

  const saksbehandlerNavn =
    saksbehandler?.navn || saksbehandler?.brukernavn || "";

  const erDev = env !== "production";

  const navigerTilBehandlingsoversikt = (fagsakPersonId: string) => {
    navigate(`/person/${fagsakPersonId}/behandlingsoversikt`);
    settSøk("");
    settFeilmelding(null);
  };

  const handleSøkOgNavigate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!søk) {
      settFeilmelding("Skriv inn en personident eller fagsakPersonId.");
      return;
    }

    settSøker(true);
    settFeilmelding(null);

    try {
      const response = await hentEllerOpprettFagsak(søk);
      const fagsak = response.data?.data;

      if (fagsak?.fagsakPersonId) {
        navigerTilBehandlingsoversikt(fagsak.fagsakPersonId);
        return;
      }

      settFeilmelding(
        response.data?.frontendFeilmelding ||
          response.error ||
          "Fant ingen fagsak for søket."
      );
    } catch (error) {
      console.error("Fagsaksøk feilet", error);
      settFeilmelding("Kunne ikke søke etter fagsak akkurat nå.");
    } finally {
      settSøker(false);
    }
  };

  const handleSøkChange = (value: string) => {
    settSøk(value);

    if (feilmelding) {
      settFeilmelding(null);
    }
  };

  return (
    <InternalHeader className={erDev ? styles.devHeader : undefined}>
      <InternalHeader.Title as="a" href="/">
        Gjenlevende BS
      </InternalHeader.Title>
      <Spacer />

      <HStack
        as="form"
        align="center"
        onSubmit={(event) => handleSøkOgNavigate(event)}
      >
        <VStack gap="1">
          <Search
            label="Søk etter fagsak"
            size="small"
            variant="simple"
            placeholder="ident eller fagsak"
            onChange={handleSøkChange}
            value={søk}
            aria-busy={søker}
          />
        </VStack>
      </HStack>

      <Dropdown>
        <InternalHeader.UserButton
          as={Dropdown.Toggle}
          name={saksbehandlerNavn}
          description={`Enhet: ${"ukjent"}`}
        />

        <Dropdown.Menu>
          <dl>
            <BodyShort as="dt" size="small">
              {saksbehandlerNavn}
            </BodyShort>
            <Detail as="dd">{saksbehandler?.navident}</Detail>
          </dl>
          <Dropdown.Menu.Divider />

          <Dropdown.Menu.List>
            <Dropdown.Menu.List.Item as="a" href="/oauth2/logout">
              Logg ut <Spacer /> <LeaveIcon aria-hidden fontSize="1.5rem" />
            </Dropdown.Menu.List.Item>
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>
    </InternalHeader>
  );
};

export default Header;
