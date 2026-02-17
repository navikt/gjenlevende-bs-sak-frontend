const HENDELSE_NAVN = "endringshistorikk:oppdater";

export const oppdaterEndringshistorikk = () => {
  window.dispatchEvent(new Event(HENDELSE_NAVN));
};

export const lyttPåEndringshistorikk = (callback: () => void) => {
  window.addEventListener(HENDELSE_NAVN, callback);
  return () => window.removeEventListener(HENDELSE_NAVN, callback);
};
