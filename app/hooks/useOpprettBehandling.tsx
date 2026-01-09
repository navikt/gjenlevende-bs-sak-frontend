import { useState, useCallback } from "react";
import { opprettBehandlingApi } from "~/api/backend";

interface OpprettBehandling {
  opprettBehandling: (fagsakId: string) => Promise<string | undefined>;
  oppretter: boolean;
  opprettFeilmelding: string | null;
}

export const useOpprettBehandling = (): OpprettBehandling => {
  const [oppretter, settOppretter] = useState(false);
  const [opprettFeilmelding, settOpprettFeilmelding] = useState<string | null>(null);

  const opprettBehandling = useCallback(async (fagsakId: string): Promise<string | undefined> => {
    settOppretter(true);
    settOpprettFeilmelding(null);
    try {
      const response = await opprettBehandlingApi(fagsakId);
      if (!response.data && response.melding) {
        settOpprettFeilmelding(response.melding);
        return undefined;
      }
      return response.data;
    } catch (error) {
      settOpprettFeilmelding("Kunne ikke opprette behandling: " + error);
      return undefined;
    } finally {
      settOppretter(false);
    }
  }, []);

  return {
    opprettBehandling,
    oppretter,
    opprettFeilmelding,
  };
};
