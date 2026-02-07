import { BodyShort, Radio, RadioGroup, VStack } from "@navikt/ds-react";
import React from "react";
import { usePersonContext } from "~/contexts/PersonContext";
import { type Brevmottaker, BrevmottakerRolle } from "~/hooks/useBrevmottaker";

interface Props {
  mottakere: Brevmottaker[];
  leggTilMottaker: (mottaker: Brevmottaker) => void;
  fjernMottaker: (index: number) => void;
}

export function SkalBrukerMottaBrev({ mottakere, leggTilMottaker, fjernMottaker }: Props) {
  const { personident } = usePersonContext();
  const brukerSkalHaBrev = mottakere.some(
    (mottaker) => mottaker.personRolle === BrevmottakerRolle.BRUKER
  );

  const håndterLeggTilBruker = () => {
    if (!brukerSkalHaBrev) {
      leggTilMottaker({
        mottakerType: "PERSON",
        personRolle: BrevmottakerRolle.BRUKER,
        personident: personident,
      });
    }
  };

  const håndterFjernBruker = () => {
    const brukerIndex = mottakere.findIndex(
      (mottaker) => mottaker.personRolle === BrevmottakerRolle.BRUKER
    );
    if (brukerIndex !== -1) {
      fjernMottaker(brukerIndex);
    }
  };

  return (
    <VStack gap={"4"}>
      <BodyShort size={"large"}>Skal bruker motta brevet?</BodyShort>
      <RadioGroup
        legend={"Skal bruker motta brevet?"}
        hideLegend
        value={brukerSkalHaBrev ? "Ja" : "Nei"}
      >
        <Radio value={"Ja"} name={"brukerHaBrevRadio"} onChange={håndterLeggTilBruker}>
          Ja
        </Radio>
        <Radio value={"Nei"} name={"brukerHaBrevRadio"} onChange={håndterFjernBruker}>
          Nei
        </Radio>
      </RadioGroup>
    </VStack>
  );
}
