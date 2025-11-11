import type { Request, Response, NextFunction } from "express";

const PUBLIC_PATHS = [
  "/oauth2/login",
  "/oauth2/callback",
  "/oauth2/logout",
  "/isAlive",
  "/isReady",
];

export function kreverAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const erPublicPath = PUBLIC_PATHS.some((path) => req.path.startsWith(path));
  const erAsset = req.path.startsWith("/assets") || req.path.includes(".");

  if (!erPublicPath && !erAsset && !req.session.user) {
    res.redirect("/oauth2/login");
    return;
  }

  next();
}
