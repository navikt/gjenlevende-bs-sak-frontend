import { useState, useCallback } from "react";
import {  opprettBehandlingApi } from "~/api/backend";

interface OpprettBehandling {
  opprettBehandling: (fagsakId: string) => Promise<void>;
  oppretter: boolean;
  opprettFeilmelding: string | null;
}

export const useOpprettBehandling = (): OpprettBehandling => {
  const [oppretter, settOppretter] = useState(false);
  const [opprettFeilmelding, settOpprettFeilmelding] = useState<string | null>(null);

  const opprettBehandling = useCallback(
    async (fagsakId: string) => {

      settOppretter(true);
      settOpprettFeilmelding(null);

      try {
        const response = await opprettBehandlingApi(fagsakId);

        console.log(response)


        settOpprettFeilmelding(
          "Kunne ikke opprette fagsak."
        );
      } catch (error) {
        console.error("Opprettelse av fagsak feilet", error);
        settOpprettFeilmelding("Kunne ikke opprette fagsak akkurat nå.");
      } finally {
        settOppretter(false);
      }
    },
    []
  );

  return {
    opprettBehandling,
    oppretter,
    opprettFeilmelding,
  };
};
