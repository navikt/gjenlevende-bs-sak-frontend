import React, { useState } from "react";
import { Button, Radio, RadioGroup, Stack, TextField, VStack } from "@navikt/ds-react";
import { BrevmottakerRolle } from "~/hooks/useBrevmottaker";

export const OrganisasjonsSøk: React.FC = () => {
  // const [mottakerRolle, settMottakerRolle] = useState<BrevmottakerRolleOrganisasjon>(
  //   EBrevmottakerRolle.FULLMEKTIG
  // );
  const [organisasjonsnummer, settOrganisasjonsnummer] = useState("");
  const [kontaktpersonHosOrganisasjon, settKontaktpersonHosOrganisasjon] = useState("");
  const [mottakerRolle, settMottakerRolle] = useState<BrevmottakerRolle>();

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
        <div>
          <Button
            onClick={() => {}} // Legge til organisasjon og navn i mottakerlisten
          >
            Legg til
          </Button>
          <TextField
            htmlSize={25}
            label={"Ved"}
            placeholder={"Personen brevet skal til"}
            value={kontaktpersonHosOrganisasjon}
            onChange={(e) => settKontaktpersonHosOrganisasjon(e.target.value)}
            autoComplete="off"
          />
        </div>
      </VStack>
    </>
  );
};

export interface IOrganisasjon {
  navn: string;
  organisasjonsnummer: string;
}
