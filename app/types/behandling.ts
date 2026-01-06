export interface Behandling {
  id: string;
  fagsakId: string;
  status: "OPPRETTET" | "UTREDES" | "FERDIGSTILT";
  sistEndret: string;
  opprettet: string;
  opprettetAv: string;
}
