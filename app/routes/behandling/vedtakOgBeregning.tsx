import React from "react";
import type { Route } from "./+types/vedtakOgBeregning";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Vedtak og beregning" }];
}

export default function VedtakOgBeregning() {
  return <div>Vedtak og beregning</div>;
}
