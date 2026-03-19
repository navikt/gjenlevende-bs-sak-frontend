import type { Request, Response } from "express";
import { hentAccessToken } from "./utils/token.js";
import { exchangeTokenForBackend } from "./obo-token-exchange.js";

const GJENLEVENDE_BS_SAK_AUDIENCE = "api://dev-gcp.etterlatte.gjenlevende-bs-sak/.default";

const byggBackendUrl = (backendUrl: string, req: Request, backendApiPrefix: string): string => {
  return `${backendUrl}${backendApiPrefix}${req.url}`;
};

const hentTokenForBackend = async (
  req: Request,
  erLokalt: boolean,
  audience: string
): Promise<string | undefined> => {
  const token = hentAccessToken(req, erLokalt);

  if (!token) {
    console.error("Ingen token funnet. erLokalt:", erLokalt);
    return;
  }

  if (erLokalt) {
    return token;
  }

  try {
    return await exchangeTokenForBackend(token, audience);
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

export function lagApiProxy(
  backendUrl: string,
  erLokalt: boolean,
  audience = GJENLEVENDE_BS_SAK_AUDIENCE,
  backendApiPrefix = "/api"
) {
  return async (req: Request, res: Response) => {
    try {
      const token = await hentTokenForBackend(req, erLokalt, audience);

      if (!token) {
        res.status(401).json({ error: "Ikke autentisert" });
        return;
      }

      const url = byggBackendUrl(backendUrl, req, backendApiPrefix);
      console.log("Proxying request til:", url);

      const backendResponse = await kallBackend(url, req, token);
      console.log("Backend response status:", backendResponse.status);

      if (backendResponse.status === 204) {
        res.status(204).end();
        return;
      }

      const data = await backendResponse.json();
      res.status(backendResponse.status).send(data);
    } catch (error) {
      const errorMelding = error instanceof Error ? error.message : "Ukjent feil";

      console.error("API proxy error:", error);
      res.status(500).json({ error: "Feil ved kall til backend", melding: errorMelding });
    }
  };
}
