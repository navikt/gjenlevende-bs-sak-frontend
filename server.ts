import express, { type Request, type Response } from "express";
import { createRequestListener } from "@react-router/node";
import type { ServerBuild } from "react-router";
import type { ViteDevServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";
import { getToken, requestAzureOboToken } from "@navikt/oasis";

const viteDevServer: ViteDevServer | undefined =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: {
            middlewareMode: true,
            host: true,
          },
        })
      );

const app = express();

app.get("/isAlive", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.get("/isReady", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// API proxy med Oasis token exchange
app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.BACKEND_URL || "http://gjenlevende-bs-sak",
    changeOrigin: true,
    on: {
      proxyReq: async (proxyReq: any, req: any) => {
        try {
          // Hent token fra request (fra Wonderwall sidecar cookie)
          const token = getToken(req);

          if (!token) {
            console.warn("⚠️  Ingen token funnet i request - kan være at bruker ikke er autentisert");
            return;
          }

          console.log("✓ Token hentet fra request");

          // Bytt token til backend-spesifikk token via OBO
          const backendAudience =
            process.env.BACKEND_AUDIENCE ||
            "dev-gcp:etterlatte:gjenlevende-bs-sak";

          console.log(`→ Forsøker OBO token exchange med audience: ${backendAudience}`);

          const oboResult = await requestAzureOboToken(token, backendAudience);

          if (oboResult.ok) {
            proxyReq.setHeader("Authorization", `Bearer ${oboResult.token}`);
            console.log("✓ OBO token exchanged og Authorization header satt");
          } else {
            console.error("❌ Feil ved OBO token exchange - backend vil sannsynligvis returnere 401/403", oboResult);
          }
        } catch (error) {
          console.error("❌ Feil ved token-håndtering:", error);
        }
      },
      error: (err: any, req: any, res: any) => {
        console.error("Proxy error:", err);
        res.status(500).json({
          feilmelding: "Feil ved kall til backend",
          detaljer: err.message
        });
      }
    },
  })
);

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", {
      immutable: true,
      maxAge: "1y",
    })
  );
}

app.use(express.static("build/client", { maxAge: "1h" }));

const getBuild = async (): Promise<ServerBuild> => {
  if (viteDevServer) {
    return viteDevServer.ssrLoadModule(
      "virtual:react-router/server-build"
    ) as Promise<ServerBuild>;
  }
  // @ts-ignore
  return import("/app/build/server/index.js");
};

const requestListener = createRequestListener({
  build: viteDevServer ? getBuild : await getBuild(),
});

app.all("*", (req, res) => {
  requestListener(req, res);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Express server startet");
  console.log(`Port: ${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`BACKEND_URL: ${process.env.BACKEND_URL || "http://gjenlevende-bs-sak"}`);
  console.log(`BACKEND_AUDIENCE: ${process.env.BACKEND_AUDIENCE || "dev-gcp:etterlatte:gjenlevende-bs-sak"}`);
  console.log("Oasis token exchange: aktivert");
});
