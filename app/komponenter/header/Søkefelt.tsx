import React, { useState } from "react";
import { HStack, Search, VStack } from "@navikt/ds-react";
import type { Søkeresultat } from "~/api/backend";
import { SøkePopover, erGyldigSøkestreng } from "./SøkePopover";

interface SøkefeltProps {
  søk: string;
  onSøkChange: (value: string) => void;
  søker: boolean;
  feilmelding: string | null;
  søkeresultat: Søkeresultat | null;
  onNavigate: (fagsakPersonId: string) => void;
  onOpprettFagsak: () => void;
  onClearSøk: () => void;
  opprettFeilmelding?: string | null;
}

export const Søkefelt: React.FC<SøkefeltProps> = ({
  søk,
  onSøkChange,
  søker,
  feilmelding,
  søkeresultat,
  onNavigate,
  onOpprettFagsak,
  onClearSøk,
  opprettFeilmelding,
}) => {
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && søkeresultat?.harFagsak && søkeresultat?.fagsakPersonId) {
      onNavigate(søkeresultat.fagsakPersonId);
    }
  };

  const erPopoverÅpen =
    erGyldigSøkestreng(søk) && (søker || !!søkeresultat || !!feilmelding || !!opprettFeilmelding);

  return (
    <HStack align="center">
      <VStack gap="1">
        <Search
          label="Søk etter personident"
          size="small"
          variant="simple"
          placeholder="ident eller fagsak"
          onChange={onSøkChange}
          onKeyDown={handleKeyDown}
          value={søk}
          aria-busy={søker}
          ref={setAnchor}
        />
        <SøkePopover
          open={erPopoverÅpen}
          onClose={onClearSøk}
          anchorEl={anchor}
          søker={søker}
          feilmelding={feilmelding}
          søkeresultat={søkeresultat}
          onNavigate={onNavigate}
          onOpprettFagsak={onOpprettFagsak}
          opprettFeilmelding={opprettFeilmelding}
        />
      </VStack>
    </HStack>
  );
};
