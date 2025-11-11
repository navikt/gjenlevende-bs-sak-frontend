import type { Request } from "express";
import type { Saksbehandler } from "../types.js";

export function parseJwtToken(token: string): Saksbehandler | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

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

export function hentSaksbehandlerFraHeaders(
  req: Request
): Saksbehandler | null {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return null;
  }

  return parseJwtToken(token);
}

export function hentAccessToken(
  req: Request,
  erLokal: boolean
): string | undefined {
  if (erLokal) {
    return req.session.user?.accessToken;
  } else {
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
  }
  return undefined;
}
