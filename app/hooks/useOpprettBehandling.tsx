import { useState, useCallback } from "react";
import { opprettBehandlingApi } from "~/api/backend";

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
        if(response.error){
            settOpprettFeilmelding("Kunne ikke opprette behandling")
        }

      } catch (error) {
        console.error("Opprettelse av fagsak feilet", error);
        settOpprettFeilmelding("Kunne ikke opprette behandling: " + error);

      } finally {
        settOppretter(false);
      }
    },
    [],
  );

  return {
    opprettBehandling,
    oppretter,
    opprettFeilmelding,
  };
};
