import { apiCall } from "./backend";

export const SAK_TYPE = {
  BARNEPENSJON: "BARNEPENSJON",
  OMSTILLINGSSTOENAD: "OMSTILLINGSSTOENAD",
} as const;

export type SakType = (typeof SAK_TYPE)[keyof typeof SAK_TYPE];

export interface ISak {
  id: number;
  sakType: SakType;
  fnr: string;
  enhet: string;
}

export async function hentSakForPerson(args: { fnr: string; type: SakType }) {
  return apiCall<ISak>(`/etterlatte-behandling/personer/sak/${args.type}`, {
    method: "POST",
    body: JSON.stringify({ foedselsnummer: args.fnr }),
  });
}
