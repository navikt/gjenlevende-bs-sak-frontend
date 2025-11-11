import type { Request, Response } from "express";
import { hentAccessToken } from "./utils/token.js";

export function lagApiProxy(backendUrl: string, erLokal: boolean) {
  return async (req: Request, res: Response) => {
    try {
      const token = hentAccessToken(req, erLokal);

      if (!token) {
        res.status(401).json({ error: "Ikke autentisert" });
        return;
      }

      const fullBackendUrl = `${backendUrl}/api${req.path}`;
      const queryString = req.url.split("?")[1];
      const urlWithQuery = queryString
        ? `${fullBackendUrl}?${queryString}`
        : fullBackendUrl;

      console.log("Proxying request til:", urlWithQuery);

      const backendResponse = await fetch(urlWithQuery, {
        method: req.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:
          req.method !== "GET" && req.method !== "HEAD"
            ? JSON.stringify(req.body)
            : undefined,
      });

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
