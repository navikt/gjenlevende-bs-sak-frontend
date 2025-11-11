import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { createRequestListener } from "@react-router/node";
import type { ServerBuild } from "react-router";
import type { ViteDevServer } from "vite";
import session from "express-session";
import cookieParser from "cookie-parser";
import { AsyncLocalStorage } from "node:async_hooks";
import "dotenv/config";
import {
  initializeAuth,
  handleLogin,
  handleCallback,
  handleLogout,
} from "./auth.js";
import type { Saksbehandler } from "./types.js";
import { MILJØ } from "./env.js";

const ÅTTE_TIMER = 1000 * 60 * 60 * 8;

declare module "express-session" {
  interface SessionData {
    user?: Saksbehandler;
    state?: string;
    nonce?: string;
    codeVerifier?: string;
  }
}

const erLokal = MILJØ.erLokal;

const viteDevServer: ViteDevServer | undefined = erLokal
  ? await import("vite").then((vite) =>
      vite.createServer({
        server: {
          middlewareMode: true,
          host: true,
        },
      })
    )
  : undefined;

const app = express();
const saksbehandlerStorage = new AsyncLocalStorage<any>();

if (erLokal) {
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fallback-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: ÅTTE_TIMER,
      },
    })
  );

  if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
    initializeAuth({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: "http://localhost:8080/oauth2/callback",
    });
  }
}

function hentSaksbehandlerInfoFraHeaders(req: Request): Saksbehandler | null {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return null;
  }

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
    console.error("Feil med token:", error);
    return null;
  }
}

app.get("/isAlive", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.get("/isReady", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

if (erLokal) {
  app.get("/oauth2/login", handleLogin);
  app.get("/oauth2/callback", handleCallback);
  app.get("/oauth2/logout", handleLogout);

  app.use((req: Request, res: Response, next: NextFunction) => {
    const publicPaths = [
      "/oauth2/login",
      "/oauth2/callback",
      "/oauth2/logout",
      "/isAlive",
      "/isReady",
    ];
    const isPublicPath = publicPaths.some((path) => req.path.startsWith(path));
    const isAsset = req.path.startsWith("/assets") || req.path.includes(".");

    if (!isPublicPath && !isAsset && !req.session.user) {
      res.redirect("/oauth2/login");
      return;
    }

    next();
  });
} else {
  app.get("/oauth2/logout", (_req: Request, res: Response) => {
    res.redirect("/oauth2/logout");
  });
}

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
  build: getBuild,
  getLoadContext: () => ({
    saksbehandler: saksbehandlerStorage.getStore() || null,
    env: MILJØ.env,
  }),
});

app.all("*", (req, res) => {
  const saksbehandler = erLokal
    ? req.session?.user || null
    : hentSaksbehandlerInfoFraHeaders(req);

  saksbehandlerStorage.run(saksbehandler, () => {
    requestListener(req, res);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`\nhttp://localhost:${port}/`);
});
