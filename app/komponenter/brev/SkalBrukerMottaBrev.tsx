import { BodyShort, Radio, RadioGroup, VStack } from "@navikt/ds-react";
import React from "react";
import { type Brevmottaker, BrevmottakerRolle } from "~/hooks/useBrevmottaker";

interface Props {
  mottakere: Brevmottaker[];
}

export function SkalBrukerMottaBrev({ mottakere }: Props) {
  const brukerSkalHaBrev = mottakere.some(
    (mottaker) => mottaker.personRolle === BrevmottakerRolle.BRUKER
  );

  return (
    <VStack gap={"4"}>
      <BodyShort>Skal bruker motta brevet?</BodyShort>
      <RadioGroup
        legend={"Skal bruker motta brevet?"}
        hideLegend
        value={brukerSkalHaBrev ? "Ja" : "Nei"}
      >
        <Radio value={"Ja"} name={"brukerHaBrevRadio"} onChange={() => {}}>
          Ja
        </Radio>
        <Radio value={"Nei"} name={"brukerHaBrevRadio"} onChange={() => {}}>
          Nei
        </Radio>
      </RadioGroup>
    </VStack>
  );
}
