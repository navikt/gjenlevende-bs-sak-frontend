import React, { useState } from "react";
import { HStack, Search, VStack } from "@navikt/ds-react";
import { SøkePopover } from "./SøkePopover";
import { erGyldigSøkestreng } from "~/utils/utils";
import type { Søkeresultat } from "~/hooks/useSøk";

interface SøkefeltProps {
  søk: string;
  onSøkChange: (value: string) => void;
  søker: boolean;
  feilmelding: string | null;
  søkeresultat: Søkeresultat | null;
  onNavigate: (fagsakPersonId: string) => void;
  onOpprettFagsak: () => void;
  onTilbakestillSøk: () => void;
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
  onTilbakestillSøk,
  opprettFeilmelding,
}) => {
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && søkeresultat?.harFagsak && søkeresultat?.fagsakPersonId) {
      onNavigate(søkeresultat.fagsakPersonId);
    }
  };

  const skalÅpneSøkePopover =
    erGyldigSøkestreng(søk) && (søker || !!søkeresultat || !!feilmelding || !!opprettFeilmelding);

  return (
    <HStack align="center">
      <VStack gap="space-1">
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
          open={skalÅpneSøkePopover}
          onClose={onTilbakestillSøk}
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
