import { createContext, useContext } from "react";
import type { Navn } from "~/api/backend";

interface PersonContextType {
  navn: Navn;
  fødselsnummer: string;
  laster: boolean;
  error: string | null;
}

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
