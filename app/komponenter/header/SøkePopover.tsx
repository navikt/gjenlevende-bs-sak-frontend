import React from "react";
import {
  BodyShort,
  Button,
  Detail,
  Heading,
  HStack,
  Loader,
  Popover,
  VStack,
} from "@navikt/ds-react";
import type { Søkeresultat } from "~/api/backend";
import { erGyldigFagsakPersonId, erGyldigPersonident } from "~/utils/utils";

interface SøkePopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLDivElement | null;
  søker: boolean;
  feilmelding: string | null;
  søkeresultat: Søkeresultat | null;
  onNavigate: (fagsakPersonId: string) => void;
  onOpprettFagsak: () => void;
  opprettFeilmelding?: string | null;
}

export const SøkePopover: React.FC<SøkePopoverProps> = ({
  open,
  onClose,
  anchorEl,
  søker,
  feilmelding,
  søkeresultat,
  onNavigate,
  onOpprettFagsak,
  opprettFeilmelding,
}) => {
  const visFeilmelding = feilmelding || opprettFeilmelding;

  return (
    <Popover open={open} onClose={onClose} anchorEl={anchorEl} placement="bottom" arrow={false}>
      <Popover.Content>
        {søker && !søkeresultat ? (
          <HStack gap="3" align="center">
            <Loader size="small" />
            <BodyShort>Søker...</BodyShort>
          </HStack>
        ) : visFeilmelding ? (
          <VStack gap="2">
            <BodyShort>{visFeilmelding}</BodyShort>
          </VStack>
        ) : søkeresultat ? (
          <VStack gap="3">
            <div>
              <Heading level="2" size="xsmall" spacing>
                {søkeresultat.navn}
              </Heading>
              <Detail>{søkeresultat.personident || søkeresultat.fagsakPersonId}</Detail>
            </div>

            {søkeresultat.harFagsak ? (
              <Button
                size="small"
                onClick={() => onNavigate(søkeresultat.fagsakPersonId)}
                disabled={søker}
              >
                Gå til oversikt
              </Button>
            ) : (
              <Button size="small" onClick={onOpprettFagsak} disabled={søker} loading={søker}>
                Opprett fagsak
              </Button>
            )}
          </VStack>
        ) : null}
      </Popover.Content>
    </Popover>
  );
};

export const erGyldigSøkestreng = (str: string): boolean => {
  const trimmet = str.trim();
  return erGyldigPersonident(trimmet) || erGyldigFagsakPersonId(trimmet);
};
