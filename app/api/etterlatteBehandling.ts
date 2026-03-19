import { apiCall } from "./backend";

export const SAK_TYPE = {
  BARNEPENSJON: "BARNEPENSJON",
  OMSTILLINGSSTOENAD: "OMSTILLINGSSTOENAD",
} as const;

export type SakType = (typeof SAK_TYPE)[keyof typeof SAK_TYPE];

export interface SakId {
  id: number;
}

export async function hentEtterlatteSakIdMedPersonident(args: { fnr: string }) {
  return apiCall<SakId>(`/etterlatte-behandling/personer/sak`, {
    method: "POST",
    body: JSON.stringify({ foedselsnummer: args.fnr }),
  });
}
