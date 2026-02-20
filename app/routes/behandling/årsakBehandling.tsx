import React, { useEffect } from "react";
import type { Route } from "./+types/årsakBehandling";
import {
  Alert,
  Box,
  Button,
  DatePicker,
  HStack,
  Loader,
  Select,
  Textarea,
  useDatepicker,
  VStack,
} from "@navikt/ds-react";
import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { useBehandlingSteg } from "~/hooks/useBehandlingSteg";
import { useNavigate } from "react-router";
import { useMarkerStegFerdige } from "~/hooks/useMarkerStegFerdige";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useArsakBehandling } from "~/hooks/useÅrsakBehandling";
import { useErLesevisning } from "~/hooks/useErLesevisning";
import type { ÅrsakType } from "~/types/årsak";
import type { StegPath } from "~/komponenter/navbar/BehandlingFaner";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Årsak behandling" }];
}

const STEG_NAVN = "Årsak behandling";
const STEG_PATH: StegPath = "arsak-behandling";

const ÅRSAK_ALTERNATIVER = [
  { verdi: "SØKNAD", label: "Søknad" },
  { verdi: "NYE_OPPLYSNINGER", label: "Nye opplysninger" },
  { verdi: "ANNET", label: "Annet" },
] as const;

export default function ArsakBehandling() {
  const erLesevisning = useErLesevisning();

  const { behandlingId, årsakDataHentet } = useBehandlingContext();
  const navigate = useNavigate();
  const { finnNesteSteg } = useBehandlingSteg();

  const {
    kravdato,
    årsak,
    beskrivelse,
    laster,
    feilmelding,
    erLagret,
    låst,
    oppdaterKravdato,
    oppdaterÅrsak,
    oppdaterBeskrivelse,
    lagre,
    settLåst,
    tilbakestill,
  } = useArsakBehandling(behandlingId);

  const { datepickerProps, inputProps, setSelected } = useDatepicker({
    defaultSelected: kravdato,
    onDateChange: oppdaterKravdato,
  });

  useMarkerStegFerdige(STEG_NAVN, erLagret);

  const erLåst = låst || erLesevisning;
  const kanLagre = kravdato !== undefined && årsak !== "";

  const håndterLagring = async () => {
    const suksess = await lagre();
    if (suksess) {
      settLåst(true);
    }
  };

  const navigerTilNeste = () => {
    const nesteSteg = finnNesteSteg(STEG_PATH);
    if (nesteSteg) {
      navigate(`../${nesteSteg.path}`, { relative: "path" });
    }
  };

  useEffect(() => {
    setSelected(kravdato);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kravdato]);

  if (!årsakDataHentet) {
    return (
      <Box shadow="dialog" background="neutral-soft" padding="space-24" borderRadius="4">
        <Loader size="medium" />
      </Box>
    );
  }

  return (
    <VStack gap="space-24">
      <Box shadow="dialog" background="neutral-soft" padding="space-24" borderRadius="4">
        <VStack gap="space-24" style={{ position: "relative" }}>
          {låst && !erLesevisning && (
            <HStack gap="space-2" style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}>
              <Button
                variant="tertiary"
                size="small"
                icon={<PencilIcon title="Rediger" />}
                onClick={() => settLåst(false)}
              >
                Rediger
              </Button>
              <Button
                variant="tertiary"
                size="small"
                icon={<TrashIcon title="Slett" fontSize="1.5rem" />}
                onClick={tilbakestill}
              >
                Slett
              </Button>
            </HStack>
          )}

          <VStack gap="space-16">
            <div style={{ maxWidth: "24rem" }}>
              <DatePicker {...datepickerProps}>
                <DatePicker.Input {...inputProps} label="Kravdato" readOnly={erLåst} />
              </DatePicker>
            </div>

            <Select
              label="Årsak til behandling"
              onChange={(e) => oppdaterÅrsak(e.target.value as ÅrsakType)}
              value={årsak}
              disabled={erLåst}
              style={{ maxWidth: "24rem" }}
            >
              <option value="" disabled>
                Velg årsak
              </option>
              {ÅRSAK_ALTERNATIVER.map(({ verdi, label }) => (
                <option key={verdi} value={verdi}>
                  {label}
                </option>
              ))}
            </Select>

            <Textarea
              label="Beskrivelse av årsak (fylles ut ved behov)"
              onChange={(e) => oppdaterBeskrivelse(e.target.value)}
              value={beskrivelse}
              readOnly={erLåst}
            />
          </VStack>

          {!låst && (
            <div>
              <Button onClick={håndterLagring} disabled={!kanLagre || erLesevisning} loading={laster}>
                Lagre
              </Button>
            </div>
          )}

          {feilmelding && (
            <Alert variant="error" size="small">
              {feilmelding}
            </Alert>
          )}
        </VStack>
      </Box>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={navigerTilNeste} disabled={!erLagret}>
          Neste
        </Button>
      </div>
    </VStack>
  );
}
