import { useContext } from "react";
import { BehandlingContext } from "~/contexts/BehandlingContext";
import type { StegPath } from "~/komponenter/navbar/BehandlingFaner";

export function useBehandlingSteg() {
  const { stegListe, ferdigeSteg } = useContext(BehandlingContext);

  if (!stegListe) {
    throw new Error("useBehandlingSteg må brukes innenfor BehandlingContext med behandlingSteg");
  }

  const finnSteg = (nåværendeStegPath: StegPath, retning: number) => {
    const nåværendeIndex = stegListe.findIndex((steg) => steg.path === nåværendeStegPath);
    const målIndex = nåværendeIndex + retning;

    if (nåværendeIndex === -1 || målIndex < 0 || målIndex >= stegListe.length) {
      return null;
    }

    return stegListe[målIndex];
  };

  const finnNesteSteg = (path: StegPath) => finnSteg(path, 1);
  const finnForrigeSteg = (path: StegPath) => finnSteg(path, -1);

  return {
    stegListe,
    ferdigeSteg,
    finnNesteSteg,
    finnForrigeSteg,
  };
}
