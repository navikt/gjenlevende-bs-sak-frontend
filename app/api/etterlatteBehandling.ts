import { apiCall } from "./backend";

export const SAK_TYPE = {
  BARNEPENSJON: "BARNEPENSJON",
  OMSTILLINGSSTOENAD: "OMSTILLINGSSTOENAD",
} as const;

export type SakType = (typeof SAK_TYPE)[keyof typeof SAK_TYPE];

export interface SakId {
  sakId: number;
}

export async function hentEtterlatteSakIdMedPersonident(args: { fnr: string }) {
  return apiCall<SakId>(`/etterlatte-behandling/personer/sakid`, {
    method: "POST",
    body: JSON.stringify({ foedselsnummer: args.fnr }),
  });
}
