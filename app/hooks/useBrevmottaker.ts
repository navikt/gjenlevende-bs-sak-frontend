import { useState } from "react";
import { usePersonContext } from "~/contexts/PersonContext";

export enum BrevmottakerRolle {
  "BRUKER" = "BRUKER",
  "VERGE" = "VERGE",
  "FULLMEKTIG" = "FULLMEKTIG",
  "ANNEN" = "ANNEN",
}

export type MottakerType = "PERSON" | "ORGANISASJON";

export interface Brevmottaker {
  personRolle?: BrevmottakerRolle;
  mottakerType: MottakerType;
  personident?: string;
  orgnr?: string;
  navnHosOrganisasjon?: string;
}

export const useBrevmottaker = () => {
  const { personident } = usePersonContext();
  const [mottakere, settMottakere] = useState<Brevmottaker[]>([
    { mottakerType: "PERSON", personRolle: BrevmottakerRolle.BRUKER, personident: personident },
  ]);
  const [modalÅpen, settModalÅpen] = useState(false);

  const leggTilMottaker = (mottaker: Brevmottaker) => {
    settMottakere((prev) => [...prev, mottaker]);
  };

  const fjernMottaker = (index: number) => {
    settMottakere((prev) => prev.filter((_, i) => i !== index));
  };

  const utledBrevmottakere = () => {
    return mottakere
      .map((mottaker) => {
        if (mottaker.mottakerType === "ORGANISASJON") {
          return `${mottaker.orgnr} v/ ${mottaker.navnHosOrganisasjon} (organisasjon)`;
        }
        switch (mottaker.personRolle) {
          case "BRUKER":
            return `${mottaker.personident} (bruker)`;
          case "VERGE":
            return `${mottaker.personident} (verge)`;
          case "FULLMEKTIG":
            return `${mottaker.personident} (fullmektig)`;
          default:
            return "";
        }
      })
      .join(", ");
  };

  return {
    mottakere,
    settMottakere,
    leggTilMottaker,
    fjernMottaker,
    utledBrevmottakere,
    modalÅpen,
    settModalÅpen,
  };
};
