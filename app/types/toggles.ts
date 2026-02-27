export const ToggleNavn = {
  TestToggle: "gjenlevende_frontend__test_setup",
  HoppOverTotrinnskontroll: "gjenlevende-bs-sak-hopp-over-totrinnskontroll",
  HenleggBehandling: "gjenlevende-bs-sak-henlegg-behandling",
} as const;

type ToggleNøkkel = keyof typeof ToggleNavn;

type ToggelVerdi = (typeof ToggleNavn)[ToggleNøkkel];

export type Toggles = Partial<Record<ToggelVerdi, boolean>>;
