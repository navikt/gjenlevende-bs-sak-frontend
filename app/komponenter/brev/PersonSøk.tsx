import React, { useState } from "react";
import {
  BodyShort,
  Button,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { type Brevmottaker, BrevmottakerRolle } from "~/hooks/useBrevmottaker";

interface Props {
  leggTilMottaker: (mottaker: Brevmottaker) => void;
}

export function PersonSøk({ leggTilMottaker }: Props) {
  const [personident, settPersonident] = useState("");
  const [mottakerRolle, settMottakerRolle] = useState<BrevmottakerRolle>();

  const håndterLeggTilPerson = () => {
    if (personident && mottakerRolle) {
      const nyPersonMottaker: Brevmottaker = {
        personident: personident,
        personRolle: mottakerRolle,
        mottakerType: "PERSON",
      };
      leggTilMottaker(nyPersonMottaker);
    }
  };

  return (
    <>
      <TextField
        label={"Personident"}
        htmlSize={26}
        placeholder={"Personen som skal ha brevet"}
        value={personident}
        onChange={(e) => settPersonident(e.target.value)}
        autoComplete="off"
        style={{
          width: "50%",
          paddingRight: "1rem",
        }}
      />
      {personident && (
        <VStack>
          <RadioGroup
            legend="Velg mottakerrolle"
            onChange={(rolle: BrevmottakerRolle) => settMottakerRolle(rolle)}
            value={mottakerRolle}
          >
            <Stack gap="space-0 space-24" direction={"row"} wrap={false}>
              <Radio value={BrevmottakerRolle.FULLMEKTIG}>Fullmektig</Radio>
              <Radio value={BrevmottakerRolle.VERGE}>Verge</Radio>
            </Stack>
          </RadioGroup>
          <HStack
            style={{ background: "rgba(196, 196, 196, 0.2)" }}
            padding={"2"}
            gap={"24"}
            justify={"space-between"}
          >
            <VStack>
              <BodyShort>Hent navn her</BodyShort>
              <BodyShort>{personident}</BodyShort>
            </VStack>
            <Button
              style={{ width: "fit-content", alignSelf: "center", marginRight: "2rem" }}
              variant={"secondary"}
              size={"small"}
              onClick={() => {
                håndterLeggTilPerson();
              }}
            >
              Legg til
            </Button>
          </HStack>
        </VStack>
      )}
    </>
  );
}
