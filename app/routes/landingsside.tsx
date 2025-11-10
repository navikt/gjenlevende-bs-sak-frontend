import { Heading, BodyShort, Button } from "@navikt/ds-react";
import type { Route } from "./+types/landingsside";
import type { Saksbehandler } from "~/server/types";

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

export async function loader({ context }: Route.LoaderArgs) {
  return {
    saksbehandler: (context.saksbehandler || null) as Saksbehandler | null,
  };
}

export default function Landingsside({ loaderData }: Route.ComponentProps) {
  const { saksbehandler } = loaderData;

  return (
    <div style={{ padding: "2rem" }}>
      <Heading level="1" size="large" spacing>
        Gjenlevende barnetilsyn og skolepenger
      </Heading>

      {saksbehandler && (
        <div>
          <BodyShort spacing>
            Velkommen, {saksbehandler.navn || saksbehandler.brukernavn}!
          </BodyShort>
          <BodyShort size="small">Epost: {saksbehandler.epost}</BodyShort>
          {saksbehandler.navident && (
            <BodyShort size="small">Ident: {saksbehandler.navident}</BodyShort>
          )}
          <Button
            as="a"
            href="/oauth2/logout"
            variant="secondary"
            size="small"
            style={{ marginTop: "1rem" }}
          >
            Logg ut
          </Button>
        </div>
      )}
    </div>
  );
}
