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
import {
  initializeAuth,
  handleLogin,
  handleCallback,
  handleLogout,
} from "./auth.js";
import type { Saksbehandler } from "./types.js";

const ÅTTE_TIMER = 1000 * 60 * 60 * 8;

declare module "express-session" {
  interface SessionData {
    user?: Saksbehandler;
    state?: string;
    nonce?: string;
    codeVerifier?: string;
  }
}

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
const saksbehandlerStorage = new AsyncLocalStorage<any>();

if (process.env.NODE_ENV !== "production") {
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

app.get("/isAlive", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.get("/isReady", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

if (process.env.NODE_ENV !== "production") {
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

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.user = req.session.user;
    next();
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
  build: viteDevServer ? getBuild : await getBuild(),
  getLoadContext: () => ({
    saksbehandler: saksbehandlerStorage.getStore() || null,
  }),
});

app.all("*", (req, res) => {
  const user = req.session?.user || null;
  saksbehandlerStorage.run(user, () => {
    requestListener(req, res);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
