import { useState } from "react";
import { opprettBehandlingApi } from "~/api/backend";

interface OpprettBehandling {
  opprettBehandling: (fagsakId: string) => Promise<string | undefined>;
  oppretter: boolean;
  opprettFeilmelding: string | null;
}

export const useOpprettBehandling = (): OpprettBehandling => {
  const [oppretter, settOppretter] = useState(false);
  const [opprettFeilmelding, settOpprettFeilmelding] = useState<string | null>(null);

  const opprettBehandling = async (fagsakId: string): Promise<string | undefined> => {
    settOppretter(true);
    settOpprettFeilmelding(null);

    const response = await opprettBehandlingApi(fagsakId);

    if (!response.data && response.melding) {
      settOpprettFeilmelding(response.melding);
      settOppretter(false);
      return undefined;
    }

    settOppretter(false);
    return response.data;
  };

  return {
    opprettBehandling,
    oppretter,
    opprettFeilmelding,
  };
};
