export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  melding?: string;
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

export async function pingBackend(): Promise<ApiResponse<string>> {
  return apiCall<string>("/test/infotrygd/ping");
}

export async function testMedAuth(): Promise<
  ApiResponse<{
    navIdent: string;
    navn: string;
    epost: string;
    grupper: string[];
    tokenUtstedtTid: string;
    tokenUtløperTid: string;
  }>
> {
  return apiCall("/test/infotrygd/autentisert");
}
