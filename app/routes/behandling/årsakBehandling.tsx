import React, { useEffect } from "react";
import type { Route } from "./+types/årsakBehandling";
import {
  Alert,
  Button,
  DatePicker,
  Select,
  Textarea,
  useDatepicker,
  VStack,
} from "@navikt/ds-react";
import { useBehandlingSteg } from "~/hooks/useBehandlingSteg";
import { useNavigate } from "react-router";
import { useMarkerStegFerdige } from "~/hooks/useMarkerStegFerdige";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useArsakBehandling } from "~/hooks/useÅrsakBehandling";
import type { ÅrsakType } from "~/types/årsak";
import type { StegPath } from "~/komponenter/navbar/BehandlingFaner";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Årsak behandling" }];
}

const STEG_NAVN = "Årsak behandling";
const STEG_PATH: StegPath = "arsak-behandling";
const MAKS_BREDDE = "40rem";

const ÅRSAK_ALTERNATIVER = [
  { verdi: "SØKNAD", label: "Søknad" },
  { verdi: "NYE_OPPLYSNINGER", label: "Nye opplysninger" },
  { verdi: "ANNET", label: "Annet" },
] as const;

export default function ArsakBehandling() {
  const { behandlingId } = useBehandlingContext();
  const navigate = useNavigate();
  const { finnNesteSteg } = useBehandlingSteg();

  const {
    kravdato,
    årsak,
    beskrivelse,
    laster,
    feilmelding,
    erLagret,
    oppdaterKravdato,
    oppdaterÅrsak,
    oppdaterBeskrivelse,
    lagreOgNavigerVidere,
  } = useArsakBehandling(behandlingId);

  const { datepickerProps, inputProps, setSelected } = useDatepicker({
    defaultSelected: kravdato,
    onDateChange: oppdaterKravdato,
  });

  useMarkerStegFerdige(STEG_NAVN, erLagret);

  const kanLagre = kravdato !== undefined && årsak !== "";

  const håndterLagring = async () => {
    const suksess = await lagreOgNavigerVidere();

    if (suksess) {
      const nesteSteg = finnNesteSteg(STEG_PATH);
      if (nesteSteg) {
        navigate(`../${nesteSteg.path}`, { relative: "path" });
      }
    }
  };

  useEffect(() => {
    setSelected(kravdato);
  }, [kravdato]);

  return (
    <VStack gap="6" style={{ maxWidth: MAKS_BREDDE }}>
      <DatePicker {...datepickerProps}>
        <DatePicker.Input {...inputProps} label="Kravdato" />
      </DatePicker>

      <Select
        label="Årsak til behandling"
        onChange={(e) => oppdaterÅrsak(e.target.value as ÅrsakType | "")}
        value={årsak}
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
      />

      <div>
        <Button onClick={håndterLagring} disabled={!kanLagre} loading={laster}>
          Lagre
        </Button>
      </div>

      {feilmelding && (
        <Alert variant="error" size="small">
          {feilmelding}
        </Alert>
      )}
    </VStack>
  );
}
