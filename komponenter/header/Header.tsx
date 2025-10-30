import React from "react";
import { MenuGridIcon } from "@navikt/aksel-icons";
import { InternalHeader, Spacer, Dropdown } from "@navikt/ds-react";

export const Header = () => {
  return (
    <div>
      <InternalHeader>
        <InternalHeader.Title as="h1">Gjenlevende BS</InternalHeader.Title>
        <Spacer />
        <Dropdown defaultOpen>
          <InternalHeader.Button as={Dropdown.Toggle}>
            <MenuGridIcon
              style={{ fontSize: "1.5rem" }}
              title="Systemer og oppslagsverk"
            />
          </InternalHeader.Button>
        </Dropdown>
        <InternalHeader.User name="" />
      </InternalHeader>
    </div>
  );
};

export default Header;
