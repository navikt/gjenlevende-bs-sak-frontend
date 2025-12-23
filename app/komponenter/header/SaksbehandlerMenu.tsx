import React from "react";
import { LeaveIcon } from "@navikt/aksel-icons";
import { BodyShort, Detail, Dropdown, InternalHeader, Spacer } from "@navikt/ds-react";
import type { Saksbehandler } from "~/server/types";

interface SaksbehandlerMenuProps {
  saksbehandler: Saksbehandler | null;
}

export const SaksbehandlerMenu: React.FC<SaksbehandlerMenuProps> = ({ saksbehandler }) => {
  const saksbehandlerNavn = saksbehandler?.navn || saksbehandler?.brukernavn || "";

  return (
    <Dropdown>
      <InternalHeader.UserButton
        as={Dropdown.Toggle}
        name={saksbehandlerNavn}
        description="Enhet: ukjent"
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
  );
};
