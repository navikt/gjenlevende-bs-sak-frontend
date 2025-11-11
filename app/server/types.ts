export interface Saksbehandler {
  navn: string;
  epost: string;
  oid: string;
  navident: string;
  brukernavn: string;
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface AppLoadContext {
  saksbehandler: Saksbehandler | null;
  env: "local" | "development" | "production";
  [key: string]: any;
}
