import type { Request } from "express";
import type { Saksbehandler } from "../types.js";

export function parseJwtToken(token: string): Saksbehandler | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

    return {
      navn: payload.name || "",
      epost: payload.email || payload.upn || "",
      oid: payload.oid || "",
      navident: payload.NAVident || "",
      brukernavn: payload.preferred_username || "",
    };
  } catch (error) {
    console.error("Feil ved parsing av token:", error);
    return null;
  }
}

export function hentSaksbehandlerFraHeaders(req: Request): Saksbehandler | null {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return null;
  }

  return parseJwtToken(token);
}

export function hentAccessToken(req: Request, erLokalt: boolean): string | undefined {
  if (erLokalt) {
    return req.session.user?.accessToken;
  } else {
    const authHeader = req.headers["authorization"];
    console.log("Sjekker token i dev. Authorization header finnes:", !!authHeader);

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      console.log("Token funnet:", token);
      return token;
    }

    console.error("Ingen Bearer token funnet i Authorization header");
    console.error("Authorization header verdi:", authHeader || "undefined");
  }
  return undefined;
}
