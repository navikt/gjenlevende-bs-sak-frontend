import React from "react";
import { LeaveIcon } from "@navikt/aksel-icons";
import {
  InternalHeader,
  Spacer,
  Dropdown,
  BodyShort,
  Detail,
} from "@navikt/ds-react";
import type { Saksbehandler } from "~/server/types";
import { useRouteLoaderData } from "react-router";
import styles from "./Header.module.css";

export const Header: React.FC<{}> = () => {
  const { saksbehandler, env } =
    useRouteLoaderData<{
      saksbehandler: Saksbehandler | null;
      env: "local" | "development" | "production";
    }>("root") || {};

  const saksbehandlerNavn =
    saksbehandler?.navn || saksbehandler?.brukernavn || "";

  const erDev = env !== "production";

  return (
    <div>
      <InternalHeader className={erDev ? styles.devHeader : undefined}>
        <InternalHeader.Title as="h1">Gjenlevende BS</InternalHeader.Title>
        <Spacer />

        <Dropdown defaultOpen>
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
    </div>
  );
};

export default Header;
