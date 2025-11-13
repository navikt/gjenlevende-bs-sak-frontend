const TOKEN_ENDPOINT =
  "https://login.microsoftonline.com/trygdeetaten.no/oauth2/v2.0/token";

interface OboTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function exchangeTokenForBackend(
  userToken: string,
  clientId: string,
  clientSecret: string,
  backendScope: string
): Promise<string> {
  let navIdent = "ukjent";
  try {
    const payload = JSON.parse(
      Buffer.from(userToken.split(".")[1], "base64").toString()
    );
    navIdent = payload.NAVident || "ukjent";
  } catch (e) {
    console.error("Kunne ikke parse innkommende token:", e);
  }

  console.log(`Gjør OBO token exchange for ${navIdent}`);

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

  console.log(`OBO token exchange fullført for ${navIdent}`);

  return tokenResponse.access_token;
}
