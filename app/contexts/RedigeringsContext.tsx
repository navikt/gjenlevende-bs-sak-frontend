import { createContext, useContext } from "react";

interface RedigeringsContextType {
  erRedigerbar: boolean;
  settErRedigerbar: (verdi: boolean) => void;
}

const RedigeringsContext = createContext<RedigeringsContextType | null>(null);

export function useRedigeringsContext() {
  const context = useContext(RedigeringsContext);

  if (!context) {
    throw new Error("useRedigeringsContext må brukes innenfor RedigeringsProvider");
  }

  return context;
}

export { RedigeringsContext };
export type { RedigeringsContextType };
