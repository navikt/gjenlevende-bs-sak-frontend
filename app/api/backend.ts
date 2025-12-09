export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  melding?: string;
}

export interface Navn {
  fornavn: string;
  mellomnavn?: string;
  etternavn: string;
}

export interface Journalpost {
    journalpostId: String;
    tema?: String;
    behandlingstema?: String;
    tittel?: String;
    journalforendeEnhet?: String;
    kanal?: String;
    eksternReferanseId?: String;
}

async function apiCall<T = unknown>(
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
        error: data?.error || `HTTP ${response.status}`,
        melding: data?.melding || data,
      };
    }

    return { data };
  } catch (error) {
    console.error("API call error:", error);
    return {
      error: "Nettverksfeil",
      melding: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export const hentHistorikkForPerson = async (
  fagsakPersonId: string
): Promise<ApiResponse<unknown>> => {
  // TODO: Må mappe om fagsakPersonId til personident på sikt

  return apiCall(`/test/infotrygd/perioder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ personident: fagsakPersonId }),
  });
};

export async function hentToggles(): Promise<
  ApiResponse<Record<string, boolean>>
> {
  return apiCall("/unleash/toggles");
}

export async function hentNavnFraPdl(
  ident: string
): Promise<ApiResponse<Navn>> {
  return apiCall(`/pdl/navn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ident }),
  });
}

export async function hentJournalposterMedFnr(
    fnr: string
): Promise<ApiResponse<[Journalpost]>> {
    return apiCall(`/saf/tittel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fnr }),
    });
}
