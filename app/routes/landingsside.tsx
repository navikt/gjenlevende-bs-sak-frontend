import { Heading } from "@navikt/ds-react";
import type { Route } from "./+types/landingsside";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Landingsside" },
    {
      name: "description",
      content:
        "Landingsside for saksbehandling av gjenlevende barnetilsyn og skolepenger",
    },
  ];
}

export default function Landingsside() {
  return (
    <Heading level="1" size="large">
      Gjenlevende barnetilsyn og skolepenger
    </Heading>
  );
}
