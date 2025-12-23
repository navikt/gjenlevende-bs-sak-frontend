import { useState } from "react";
import { apiCall, type ApiResponse } from "~/api/backend";
import { brevmaler } from "~/komponenter/brev/brevmaler";
import type { Brevmal, Tekstbolk } from "~/komponenter/brev/typer";

export const useBrev = () => {
  const [brevMal, settBrevmal] = useState<Brevmal | null>(null);
  const [fritekstbolker, settFritekstbolker] = useState<Tekstbolk[]>([]);
  const [sender, settSender] = useState(false);

  const leggTilFritekstbolk = () => {
    settFritekstbolker((prev) => [...prev, { underoverskrift: "", innhold: "" }]);
  };

  const flyttBolkOpp = (index: number) => {
    settFritekstbolker((prev) => {
      if (index === 0) return prev;
      const newArr = [...prev];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      return newArr;
    });
  };

  const flyttBolkNed = (index: number) => {
    settFritekstbolker((prev) => {
      if (index === prev.length - 1) return prev;
      const newArr = [...prev];
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  const oppdaterFelt = (index: number, partial: Partial<Tekstbolk>) => {
    settFritekstbolker((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], ...partial };
      return newArr;
    });
  };

  const velgBrevmal = (brevmal: string): void => {
    if (brevmal === "") {
      settBrevmal(null);
    } else {
      const valgtBrevmal = brevmaler.find((b) => b.tittel === brevmal) ?? null;
      settBrevmal(valgtBrevmal);
    }
  };

  const sendPdfTilSak = async (
    brevmal: Brevmal,
    fritekstbolker: Tekstbolk[]
  ): Promise<ApiResponse<unknown>> => {
    settSender(true);
    try {
      return apiCall(`/brev/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brevmal,
          fritekstbolker,
        }),
      });
    } finally {
      settSender(false);
    }
  };

  return {
    brevMal,
    fritekstbolker,
    sender,
    leggTilFritekstbolk,
    flyttBolkOpp,
    flyttBolkNed,
    oppdaterFelt,
    velgBrevmal,
    sendPdfTilSak,
  };
};
