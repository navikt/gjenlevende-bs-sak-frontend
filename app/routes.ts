import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landingsside.tsx"),
  route("/person/:fagsakPersonId", "routes/personLayout.tsx", [
    route("behandlingsoversikt", "routes/behandlingsoversikt.tsx"),
    route("behandling/:behandlingId", "routes/behandling/behandlingLayout.tsx", [
      route("inngangsvilkar", "routes/behandling/inngangsvilkår.tsx"),
      route("vedtak-og-beregning", "routes/behandling/vedtakOgBeregning.tsx"),
    ]),
    route("personoversikt", "routes/personoversikt.tsx"),
    route("infotrygd-historikk", "routes/infotrygdHistorikk.tsx"),
    route("brev", "routes/brev.tsx"),
    route("dokumentoversikt", "routes/dokumentoversikt.tsx"),
  ]),
] satisfies RouteConfig;
