import type { Request, Response } from "express";
import { hentAccessToken } from "./utils/token.js";
import { exchangeTokenForBackend } from "./obo-token-exchange.js";

export function lagApiProxy(backendUrl: string, erLokalt: boolean) {
  return async (req: Request, res: Response) => {
    try {
      let token = hentAccessToken(req, erLokalt);

      if (!token) {
        console.error("Ingen token funnet. erLokalt:", erLokalt);
        if (!erLokalt) {
          console.error("Headers:", JSON.stringify(req.headers, null, 2));
        }
        res.status(401).json({ error: "Ikke autentisert" });
        return;
      }

      if (!erLokalt) {
        const clientId = process.env.AZURE_APP_CLIENT_ID;
        const clientSecret = process.env.AZURE_APP_CLIENT_SECRET;
        const backendScope = "api://dev-gcp.etterlatte.gjenlevende-bs-sak/.default";

        if (!clientId || !clientSecret) {
          console.error("Mangler Azure AD konfigurasjon");
          res.status(500).json({ error: "Server konfigurasjonsfeil" });
          return;
        }

        try {
          token = await exchangeTokenForBackend(token, clientId, clientSecret, backendScope);

          // Logg NAVident fra OBO-tokenet for debugging
          try {
            const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
            console.log(`OBO token inneholder NAVident: ${payload.NAVident || "ikke funnet"}`);
          } catch (e) {
            console.log("Kunne ikke parse OBO token", e);
          }
        } catch (error) {
          console.error("OBO token exchange feilet:", error);
          res.status(500).json({
            error: "Token exchange feilet",
            melding: error instanceof Error ? error.message : "Ukjent feil",
          });
          return;
        }
      }

      const fullBackendUrl = `${backendUrl}/api${req.path}`;
      const queryString = req.url.split("?")[1];
      const urlWithQuery = queryString ? `${fullBackendUrl}?${queryString}` : fullBackendUrl;

      console.log("Proxying request til:", urlWithQuery);
      console.log("Med token fra:", erLokalt ? "session" : "OBO exchange");

      const backendResponse = await fetch(urlWithQuery, {
        method: req.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
      });

      console.log("Backend response status:", backendResponse.status);

      const contentType = backendResponse.headers.get("content-type");
      let data;

      if (contentType?.includes("application/json")) {
        data = await backendResponse.json();
      } else {
        data = await backendResponse.text();
      }

      res.status(backendResponse.status).send(data);
    } catch (error) {
      console.error("API proxy error:", error);
      res.status(500).json({
        error: "Feil ved kall til backend",
        melding: error instanceof Error ? error.message : "Ukjent feil",
      });
    }
  };
}
