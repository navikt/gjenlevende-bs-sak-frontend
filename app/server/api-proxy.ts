import type { Request, Response } from "express";
import { hentAccessToken } from "./utils/token.js";
import { exchangeTokenForBackend } from "./obo-token-exchange.js";

const BACKEND_AUDIENCE = "api://dev-gcp.etterlatte.gjenlevende-bs-sak/.default";

const byggBackendUrl = (backendUrl: string, req: Request): string => {
  return `${backendUrl}/api${req.url}`;
};

const hentTokenForBackend = async (req: Request, erLokalt: boolean): Promise<string | null> => {
  const token = hentAccessToken(req, erLokalt);

  if (!token) {
    console.error("Ingen token funnet. erLokalt:", erLokalt);
    if (!erLokalt) {
      console.error("Headers:", JSON.stringify(req.headers, null, 2));
    }
    return null;
  }

  if (erLokalt) {
    return token;
  }

  try {
    return await exchangeTokenForBackend(token, BACKEND_AUDIENCE);
  } catch (error) {
    console.error("OBO token exchange feilet:", error);
    throw error;
  }
};

const kallBackend = async (url: string, req: Request, token: string) => {
  return await fetch(url, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
};

export function lagApiProxy(backendUrl: string, erLokalt: boolean) {
  return async (req: Request, res: Response) => {
    try {
      const token = await hentTokenForBackend(req, erLokalt);

      if (!token) {
        res.status(401).json({ error: "Ikke autentisert" });
        return;
      }

      const url = byggBackendUrl(backendUrl, req);
      console.log("Proxying request til:", url);

      const backendResponse = await kallBackend(url, req, token);
      console.log("Backend response status:", backendResponse.status);

      const contentType = backendResponse.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await backendResponse.json()
        : await backendResponse.text();

      res.status(backendResponse.status).send(data);
    } catch (error) {
      const errorMelding = error instanceof Error ? error.message : "Ukjent feil";

      if (error instanceof Error && error.message.includes("OBO")) {
        console.error("Token exchange feilet:", error);
        res.status(500).json({ error: "Token exchange feilet", melding: errorMelding });
        return;
      }

      console.error("API proxy error:", error);
      res.status(500).json({ error: "Feil ved kall til backend", melding: errorMelding });
    }
  };
}
