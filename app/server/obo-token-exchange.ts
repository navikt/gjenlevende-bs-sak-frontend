import { createHash } from "node:crypto";

const TOKEN_ENDPOINT =
  "https://login.microsoftonline.com/trygdeetaten.no/oauth2/v2.0/token";

interface OboTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface TokenCache {
  token: string;
  expiresAt: number;
}

const tokenCache = new Map<string, TokenCache>();

const lagTokenCacheKey = (userToken: string): string => {
  return createHash("sha256").update(userToken).digest("hex");
};

function hentCachedToken(userToken: string): string | null {
  const cacheKey = lagTokenCacheKey(userToken);
  const cached = tokenCache.get(cacheKey);

  if (!cached) {
    return null;
  }

  // Sjekk om tokenet har utløpt (med 5 minutters margin)
  const now = Date.now();
  if (now >= cached.expiresAt - 5 * 60 * 1000) {
    tokenCache.delete(cacheKey);
    return null;
  }

  return cached.token;
}

function cacheToken(
  userToken: string,
  accessToken: string,
  expiresIn: number
): void {
  const cacheKey = lagTokenCacheKey(userToken);
  const expiresAt = Date.now() + expiresIn * 1000;

  tokenCache.set(cacheKey, {
    token: accessToken,
    expiresAt,
  });
}

export async function exchangeTokenForBackend(
  userToken: string,
  clientId: string,
  clientSecret: string,
  backendScope: string
): Promise<string> {
  const cacheKey = lagTokenCacheKey(userToken);
  const cachedToken = hentCachedToken(userToken);

  try {
    const payload = JSON.parse(
      Buffer.from(userToken.split(".")[1], "base64").toString()
    );
    const navIdent = payload.NAVident || "ukjent";

    if (cachedToken) {
      console.log(
        `Bruker cached OBO token for ${navIdent} (cache key: ${cacheKey.substring(0, 16)}...)`
      );
      return cachedToken;
    }

    console.log(
      `Gjør OBO token exchange for ${navIdent} (cache key: ${cacheKey.substring(0, 16)}...)`
    );
  } catch (e) {
    if (cachedToken) {
      console.log("Bruker cached OBO token");
      return cachedToken;
    }
    console.log("Gjør OBO token exchange for backend");
  }

  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    client_id: clientId,
    client_secret: clientSecret,
    assertion: userToken,
    scope: backendScope,
    requested_token_use: "on_behalf_of",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OBO token exchange failed:", errorText);
    throw new Error(
      `OBO token exchange failed: ${response.status} ${errorText}`
    );
  }

  const tokenResponse = (await response.json()) as OboTokenResponse;

  cacheToken(userToken, tokenResponse.access_token, tokenResponse.expires_in);

  return tokenResponse.access_token;
}
