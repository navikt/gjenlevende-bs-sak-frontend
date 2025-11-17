import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/landingsside.tsx"),
    route("/person/:fagsakId", "routes/person-layout.tsx", [
        route("vedtaksperioder", "routes/vedtaksperioderInfotrygd.tsx"),
        route("brev", "routes/brev.tsx"),
    ]),
] satisfies RouteConfig;