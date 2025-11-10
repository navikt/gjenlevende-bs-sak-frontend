export type AppEnv = "local" | "development" | "production";

export interface EnvConfig {
  env: AppEnv;
  erLokal: boolean;
  erDev: boolean;
  erProduksjon: boolean;
}

function parseAppEnv(): AppEnv {
  const envVar = process.env.ENV?.toLowerCase();

  if (envVar === "local" || envVar === "lokalt-mot-preprod") {
    return "local";
  }

  if (envVar === "development" || envVar === "dev") {
    return "development";
  }

  if (envVar === "production") {
    return "production";
  }

  return "production";
}

export function hentEnvConfig(): EnvConfig {
  const env = parseAppEnv();

  return {
    env,
    erLokal: env === "local",
    erDev: env === "development",
    erProduksjon: env === "production",
  };
}

export const MILJØ = hentEnvConfig();
