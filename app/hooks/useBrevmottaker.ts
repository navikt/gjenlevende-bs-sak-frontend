import { useEffect, useState } from "react";
import { apiCall, type ApiResponse } from "~/api/backend";
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

export const useBrevmottaker = (behandlingId?: string) => {
  const { personident } = usePersonContext();
  const [mottakere, settMottakere] = useState<Brevmottaker[]>([]);

  useEffect(() => {
    if (!behandlingId) return;

    const hentBrevmottakere = async () => {
      const response = await apiCall<Brevmottaker[]>(`/brevmottaker/${behandlingId}`);

      if (response.data && response.data.length > 0) {
        settMottakere(response.data);
      } else {
        settMottakere([
          {
            mottakerType: "PERSON",
            personRolle: BrevmottakerRolle.BRUKER,
            personident: personident,
          },
        ]);
      }
    };

    hentBrevmottakere();
  }, [behandlingId, personident]);

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

  const sendMottakereTilSak = async (
    behandlingId: string,
    brevmottakere: Brevmottaker[]
  ): Promise<ApiResponse<unknown>> => {
    return apiCall(`/brevmottaker/settMottakere/${behandlingId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brevmottakere),
    });
  };

  return {
    mottakere,
    settMottakere,
    leggTilMottaker,
    fjernMottaker,
    utledBrevmottakere,
    sendMottakereTilSak,
  };
};
