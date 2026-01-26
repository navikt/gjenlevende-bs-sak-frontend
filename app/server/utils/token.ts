import type { Request } from "express";
import { getToken, parseAzureUserToken } from "@navikt/oasis";
import type { Saksbehandler } from "../types.js";

export function parseToken(token: string): Saksbehandler | null {
  const parsed = parseAzureUserToken(token);

  if (!parsed.ok) {
    console.error("Feil ved parsing av token med Oasis");
    return null;
  }

  return {
    navn: parsed.name || "",
    epost: parsed.preferred_username || "",
    navident: parsed.NAVident || "",
    brukernavn: parsed.preferred_username || "",
  };
}

export function hentSaksbehandlerFraHeaders(req: Request): Saksbehandler | null {
  const token = getToken(req);

  if (!token) {
    return null;
  }

  return parseToken(token);
}

export function hentAccessToken(req: Request, erLokalt: boolean): string | undefined {
  if (erLokalt) {
    return req.session.user?.accessToken;
  } else {
    const token = getToken(req);

    if (!token) {
      console.error("Ingen Bearer token funnet i Authorization header");
      return undefined;
    }

    return token;
  }
}
