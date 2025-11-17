import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landingsside.tsx"),
  route("vedtaksperioderInfotrygd", "routes/vedtaksperioderInfotrygd.tsx"),
] satisfies RouteConfig;
