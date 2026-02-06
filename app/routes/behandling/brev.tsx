import React, { useState } from "react";
import { Button, Heading, HStack, Modal, Select, VStack } from "@navikt/ds-react";
import type { Route } from "./+types/brev";
import { BrevSide } from "~/komponenter/brev/BrevSide";
import { useBrevmottaker } from "~/hooks/useBrevmottaker";
import { OrganisasjonsSøk } from "~/komponenter/brev/OrganisasjonSøk";
import { BrevmottakereListe } from "~/komponenter/brev/BrevmottakereListe";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Brev" },
    {
      name: "Brev",
      content: "Brevside",
    },
  ];
}

enum Søktype {
  ORGANISASJON = "ORGANISASJON",
  PERSON = "PERSON",
}

export default function Brev() {
  const { utledBrevmottakere, modalÅpen, settModalÅpen } = useBrevmottaker();
  const [søktype, settSøktype] = useState<Søktype>();

  return (
    <VStack gap="space-4">
      <Heading level="1" size="medium">
        Brevmottaker: {utledBrevmottakere()}
        <Button variant={"tertiary"} onClick={() => settModalÅpen(true)}>
          Legg til/endre brevmottaker
        </Button>
      </Heading>
      <BrevSide />

      <Modal
        open={modalÅpen}
        onClose={() => settModalÅpen(false)}
        header={{ heading: "Brevmottakere" }}
      >
        <Modal.Body>
          <HStack gap={"4"}>
            <VStack>
              <Select
                label="Manuelt søk"
                value={søktype}
                onChange={(e) => settSøktype(e.target.value as Søktype)}
              >
                <option value="">Velg</option>
                <option value={Søktype.ORGANISASJON}>Organisasjon</option>
                <option value={Søktype.PERSON}>Person</option>
              </Select>
              {søktype === Søktype.ORGANISASJON && <OrganisasjonsSøk />}
            </VStack>
            <div style={{ border: "2px solid #f3f3f3" }}></div>
            <VStack>
              <BrevmottakereListe />
            </VStack>
          </HStack>
        </Modal.Body>
      </Modal>
    </VStack>
  );
}
