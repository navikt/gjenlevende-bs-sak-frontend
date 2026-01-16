import React, { useState } from "react";
import type { Route } from "./+types/årsakBehandling";
import { Button, DatePicker, Select, Textarea, useDatepicker, VStack } from "@navikt/ds-react";
import { useBehandlingSteg } from "~/hooks/useBehandlingSteg";
import { useNavigate } from "react-router";
import { useMarkerStegFerdige } from "~/hooks/useMarkerStegFerdige";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Årsak behandling" }];
}

interface ÅrsakBehandlingState {
  kravdato: string;
  årsak: string;
  begrunnelse: string;
}

export default function ArsakBehandling() {
  const [state, settState] = useState<ÅrsakBehandlingState>({
    kravdato: "",
    årsak: "",
    begrunnelse: "",
  });

  const [lagret, settLagret] = useState(false);
  const { datepickerProps, inputProps, selectedDay } = useDatepicker();
  const { finnNesteSteg } = useBehandlingSteg();
  const navigate = useNavigate();

  const harValgtDato = selectedDay !== undefined;
  const harValgtÅrsak = state.årsak !== "";

  const kanLagre = harValgtDato && harValgtÅrsak;

  useMarkerStegFerdige("Årsak behandling", lagret);

  //   TODO: Kan refaktorer til å ta inn argument for nåværende steg
  const navigerTilNeste = () => {
    const nesteSteg = finnNesteSteg("arsak-behandling");
    if (nesteSteg) {
      navigate(`../${nesteSteg.path}`, { relative: "path" });
    }
  };

  const handleNesteKlikk = () => {
    // TODO: Skal også lagre data til backend
    if (kanLagre) {
      settLagret(true);
      navigerTilNeste();
    }
  };

  return (
    <VStack
      gap="6"
      style={{
        maxWidth: "40rem",
      }}
    >
      <DatePicker {...datepickerProps}>
        <DatePicker.Input {...inputProps} label="Kravdato" />
      </DatePicker>

      <Select
        label="Årsak til behandling"
        onChange={(e) => settState({ ...state, årsak: e.target.value })}
        value={state.årsak}
      >
        <option value="" disabled>
          Velg årsak
        </option>
        <option value="søknad">Søknad</option>
        <option value="nyeOpplysninger">Nye opplysninger</option>
        <option value="annet">Annet</option>
      </Select>

      <Textarea
        label="Beskrivelse av årsak (fylles ut ved behov)"
        onChange={(e) => settState({ ...state, begrunnelse: e.target.value })}
        value={state.begrunnelse}
      />

      <div>
        <Button
          onClick={() => {
            console.log(`VALGT: ${selectedDay} ${state.årsak} ${state.begrunnelse}`); //TODO: Fjerne når backend er på plass
            handleNesteKlikk();
          }}
          disabled={!kanLagre}
        >
          Lagre
        </Button>
      </div>
    </VStack>
  );
}
