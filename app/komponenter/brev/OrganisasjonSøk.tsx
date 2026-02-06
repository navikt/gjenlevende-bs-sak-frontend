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
import { type Brevmottaker, BrevmottakerRolle, useBrevmottaker } from "~/hooks/useBrevmottaker";
import { PlusCircleIcon } from "@navikt/aksel-icons";

export const OrganisasjonsSøk: React.FC = () => {
  const { leggTilMottaker } = useBrevmottaker();
  const [organisasjonsnummer, settOrganisasjonsnummer] = useState("");
  const [kontaktpersonHosOrganisasjon, settKontaktpersonHosOrganisasjon] = useState("");
  const [mottakerRolle, settMottakerRolle] = useState<BrevmottakerRolle>();

  const handleLeggTilOrganisasjon = () => {
    if (!organisasjonsnummer || !kontaktpersonHosOrganisasjon || !mottakerRolle) {
      alert("Vennligst fyll inn alle feltene før du legger til organisasjonen.");
      return;
    }

    if (organisasjonsnummer && kontaktpersonHosOrganisasjon && mottakerRolle) {
      const nyOrganisasjonMottaker: Brevmottaker = {
        personRolle: mottakerRolle,
        mottakerType: "ORGANISASJON",
        orgnr: organisasjonsnummer,
        navnHosOrganisasjon: kontaktpersonHosOrganisasjon,
      };
      leggTilMottaker(nyOrganisasjonMottaker);
    }
  };

  return (
    <>
      <TextField
        label={"Organisasjonsnummer"}
        htmlSize={26}
        placeholder={"Søk"}
        value={organisasjonsnummer}
        onChange={(e) => settOrganisasjonsnummer(e.target.value)}
        autoComplete="off"
        style={{
          width: "50%",
          paddingRight: "1rem",
        }}
      />
      {organisasjonsnummer && (
        <VStack>
          <RadioGroup
            legend="Velg mottakerrolle"
            onChange={(rolle: BrevmottakerRolle) => settMottakerRolle(rolle)}
            value={mottakerRolle}
          >
            <Stack gap="space-0 space-24" direction={"row"} wrap={false}>
              <Radio value={BrevmottakerRolle.FULLMEKTIG}>Fullmektig</Radio>
              <Radio value={BrevmottakerRolle.ANNEN}>Annen mottaker</Radio>
            </Stack>
          </RadioGroup>
          <HStack style={{ background: "rgba(196, 196, 196, 0.2)" }} padding={"2"} gap={"24"}>
            <VStack gap={"1"}>
              <BodyShort>Orgnavn</BodyShort>
              <BodyShort>orgnr</BodyShort>
              <TextField
                htmlSize={25}
                label={"Ved"}
                placeholder={"Personen brevet skal til"}
                value={kontaktpersonHosOrganisasjon}
                onChange={(e) => settKontaktpersonHosOrganisasjon(e.target.value)}
                autoComplete="off"
              />
            </VStack>
            <Button
              icon={<PlusCircleIcon />}
              style={{ width: "fit-content", alignSelf: "flex-start" }}
              variant={"secondary"}
              size={"medium"}
              onClick={() => {
                handleLeggTilOrganisasjon();
              }}
            >
              Legg til
            </Button>
          </HStack>
        </VStack>
      )}
    </>
  );
};

export interface IOrganisasjon {
  navn: string;
  organisasjonsnummer: string;
}
