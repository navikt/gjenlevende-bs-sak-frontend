import {
  Heading,
  BodyShort,
  Button,
  VStack,
  Alert,
  HStack,
} from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import type { Route } from "./+types/landingsside";
import type { Saksbehandler } from "~/server/types";
import { useState } from "react";
import { pingBackend, testMedAuth } from "~/api/backend";

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
  const { saksbehandler } =
    useRouteLoaderData<{ saksbehandler: Saksbehandler | null }>("root") || {};

  const [pingStatus, settPingStatus] = useState<{
    type: "success" | "error" | "info" | null;
    message: string;
  }>({ type: null, message: "" });
  const [authStatus, settAuthStatus] = useState<{
    type: "success" | "error" | "info" | null;
    message: string;
  }>({ type: null, message: "" });

  const [laster, settLaster] = useState(false);
  const [authLaster, settAuthLaster] = useState(false);

  const handlePing = async () => {
    settLaster(true);
    settPingStatus({ type: "info", message: "Sender forespørsel..." });

    const response = await pingBackend();

    if (response.error) {
      settPingStatus({
        type: "error",
        message: `Feil: ${response.error}${response.melding ? ` - ${response.melding}` : ""}`,
      });
    } else {
      settPingStatus({
        type: "success",
        message: `Backend svarte: ${response.data}`,
      });
    }

    settLaster(false);
  };

  const handleTestAuth = async () => {
    settAuthLaster(true);
    settAuthStatus({
      type: "info",
      message: "Sender autentisert forespørsel...",
    });

    const response = await testMedAuth();

    if (response.error) {
      settAuthStatus({
        type: "error",
        message: `Feil: ${response.error}${response.melding ? ` - ${response.melding}` : ""}`,
      });
    } else {
      const data = response.data!;
      settAuthStatus({
        type: "success",
        message: `Autentisert som: ${data.navn} (${data.navIdent}). Token utløper: ${data.tokenUtløperTid}`,
      });
    }

    settAuthLaster(false);
  };

  return (
    <VStack gap="8">
      <Heading level="1" size="large" spacing>
        Gjenlevende barnetilsyn og skolepenger
      </Heading>

      {saksbehandler && (
        <VStack gap="4">
          <BodyShort spacing>
            Velkommen, {saksbehandler.navn || saksbehandler.brukernavn}!
          </BodyShort>

          <VStack gap="4">
            <HStack gap="4">
              <Button onClick={handlePing} loading={laster}>
                Test ping til backend
              </Button>
              <Button
                onClick={handleTestAuth}
                loading={authLaster}
                variant="secondary"
              >
                Test autentisert kall
              </Button>
            </HStack>

            {pingStatus.type && (
              <Alert variant={pingStatus.type}>{pingStatus.message}</Alert>
            )}

            {authStatus.type && (
              <Alert variant={authStatus.type}>{authStatus.message}</Alert>
            )}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
}
