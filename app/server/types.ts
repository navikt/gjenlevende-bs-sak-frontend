export interface Saksbehandler {
  navn: string;
  epost: string;
  oid: string;
  navident: string;
  brukernavn: string;
  accessToken?: string;
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}
