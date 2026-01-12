import { createContext, useContext } from "react";
import type { Navn, FagsakDto } from "~/api/backend";

interface PersonContextType {
  navn: Navn | null;
  personident: string;
  fagsakPersonId: string;
  fagsak: FagsakDto | null;
  fagsakId: string | undefined;
  laster: boolean;
}

// TODO: Rename etter at fagsak også er lagt til?
const PersonContext = createContext<PersonContextType | null>(null);

export function usePersonContext() {
  const context = useContext(PersonContext);
  if (!context) {
    throw new Error("usePersonContext må brukes innenfor PersonProvider");
  }
  return context;
}

export { PersonContext };
export type { PersonContextType };
