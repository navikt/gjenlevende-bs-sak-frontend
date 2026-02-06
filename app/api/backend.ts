import { erGyldigFagsakPersonId, erGyldigPersonident } from "~/utils/utils";
import type {BarnetilsynBeregningRequest, IBeløpsperioder, IVedtak} from "~/komponenter/behandling/vedtak/vedtak";

export interface ApiResponse<T = unknown> {
  data?: T;
  status?: string;
  melding?: string;
}

export interface Navn {
  fornavn: string;
  mellomnavn?: string;
  etternavn: string;
}

export type StønadType = "BARNETILSYN" | "SKOLEPENGER";

export interface FagsakRequest {
  personident?: string;
  fagsakPersonId?: string;
  stønadstype: StønadType;
}

export interface FagsakDto {
  id: string;
  fagsakPersonId: string;
  personident: string;
  stønadstype: StønadType;
  eksternId?: number;
}

export async function apiCall<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: data?.status,
        melding: data?.melding,
      };
    }

    return { data };
  } catch (error) {
    console.error("API call error:", error);
    return {
      melding: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export async function hentEllerOpprettFagsak(søkestreng: string): Promise<ApiResponse<FagsakDto>> {
  // TODO: Refaktorer - kanskje dele opp i to funksjoner
  const id = søkestreng.trim();

  if (!erGyldigFagsakPersonId(id) && !erGyldigPersonident(id)) {
    return {
      melding: "Feil ved validering av fagsakPersonId/personident",
    };
  }

  const request: FagsakRequest = erGyldigFagsakPersonId(id)
    ? { fagsakPersonId: id, stønadstype: "BARNETILSYN" }
    : { personident: id, stønadstype: "BARNETILSYN" };

  return apiCall(`/fagsak`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}