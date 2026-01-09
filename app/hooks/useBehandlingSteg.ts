import { useContext } from "react";
import { BehandlingContext } from "~/contexts/BehandlingContext";

export function useBehandlingSteg() {
  const { stegListe, ferdigeSteg } = useContext(BehandlingContext);

  if (!stegListe) {
    throw new Error("useBehandlingSteg må brukes innenfor BehandlingContext med behandlingSteg");
  }

  const finnNesteSteg = (nåværendeStegPath: string) => {
    const nåværendeIndex = stegListe.findIndex((steg) => steg.path === nåværendeStegPath);

    if (nåværendeIndex === -1 || nåværendeIndex === stegListe.length - 1) {
      return null;
    }

    return stegListe[nåværendeIndex + 1];
  };

  return {
    stegListe,
    ferdigeSteg,
    finnNesteSteg,
  };
}
