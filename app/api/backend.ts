import { erGyldigFagsakPersonId, erGyldigPersonident } from "~/utils/utils";
import type { Dokumentinfo } from "~/api/dokument";
import type { Behandling } from "~/types/behandling";

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

export interface OpprettBehandlingRequest {
  fagsakId: string;
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

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

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

export const hentHistorikkForPerson = async (
  personident: string
): Promise<ApiResponse<unknown>> => {
  return apiCall(`/test/infotrygd/perioder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ personident: personident }),
  });
};

export async function hentToggles(): Promise<ApiResponse<Record<string, boolean>>> {
  return apiCall("/unleash/toggles");
}

export async function hentNavnFraPdl(fagsakPersonId: string): Promise<ApiResponse<Navn>> {
  return apiCall(`/pdl/navn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fagsakPersonId }),
  });
}

export interface PersonidentRequest {
  personident: string;
}

export interface Søkeresultat {
  navn: string;
  personident?: string;
  fagsakPersonId: string;
  harTilgang: boolean;
  harFagsak: boolean;
}

export async function søkPerson(søkestreng: string): Promise<ApiResponse<Søkeresultat>> {
  const erFagsakPersonId = erGyldigFagsakPersonId(søkestreng);
  const body = erFagsakPersonId ? { fagsakPersonId: søkestreng } : { personident: søkestreng };

  return apiCall(`/sok/person`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

export async function opprettBehandlingApi(
  fagsakId: string
): Promise<ApiResponse<string>> {

  const request: OpprettBehandlingRequest =
     { fagsakId: fagsakId };

  return apiCall(`/behandling/opprett`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

export async function hentDokumenterForPerson(
  fagsakPersonId: string
): Promise<ApiResponse<[Dokumentinfo]>> {
  return apiCall(`/saf/dokumenter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fagsakPersonId }),
  });
}

export async function hentBehandlingerForFagsak(
  fagsakId: string
): Promise<ApiResponse<[Behandling]>> {
  return apiCall(`/behandling/hentBehandlinger`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fagsakId }),
  });
}
