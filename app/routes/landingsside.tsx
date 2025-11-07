import { Heading, Button, Alert, VStack, HStack, BodyShort } from "@navikt/ds-react";
import { useState } from "react";

export function meta() {
  return [
    { title: "Landingsside" },
    {
      name: "description",
      content:
        "Landingsside for saksbehandling av gjenlevende barnetilsyn og skolepenger",
    },
  ];
}

interface TestResultat {
  status: "success" | "error" | null;
  melding: string;
  data?: any;
}

export default function Landingsside() {
  const [resultatUautentisert, settResultatUautentisert] = useState<TestResultat>({
    status: null,
    melding: ""
  });
  const [resultatAutentisert, settResultatAutentisert] = useState<TestResultat>({
    status: null,
    melding: ""
  });
  const [lasterUautentisert, settLasterUautentisert] = useState(false);
  const [lasterAutentisert, settLasterAutentisert] = useState(false);

  const testUautentisertEndepunkt = async () => {
    settLasterUautentisert(true);
    settResultatUautentisert({ status: null, melding: "" });

    try {
      const response = await fetch("/api/test/infotrygd/uautentisert");
      const data = await response.json();

      if (response.ok) {
        settResultatUautentisert({
          status: "success",
          melding: "Uautentisert endepunkt fungerer!",
          data: data,
        });
      } else {
        settResultatUautentisert({
          status: "error",
          melding: `HTTP ${response.status}: ${data.melding || response.statusText}`,
        });
      }
    } catch (error) {
      settResultatUautentisert({
        status: "error",
        melding: `Feil ved kall: ${error instanceof Error ? error.message : "Ukjent feil"}`,
      });
    } finally {
      settLasterUautentisert(false);
    }
  };

  const testAutentisertEndepunkt = async () => {
    settLasterAutentisert(true);
    settResultatAutentisert({ status: null, melding: "" });

    try {
      const response = await fetch("/api/test/infotrygd/autentisert");

      if (response.ok) {
        const data = await response.json();
        settResultatAutentisert({
          status: "success",
          melding: "Autentisering fungerer!",
          data: data,
        });
      } else {
        const text = await response.text();
        settResultatAutentisert({
          status: "error",
          melding: `HTTP ${response.status}: ${text || response.statusText}`,
        });
      }
    } catch (error) {
      settResultatAutentisert({
        status: "error",
        melding: `Feil ved kall: ${error instanceof Error ? error.message : "Ukjent feil"}`,
      });
    } finally {
      settLasterAutentisert(false);
    }
  };

  return (
    <VStack gap="8">
      <Heading level="1" size="large">
        Gjenlevende barnetilsyn og skolepenger
      </Heading>

      <VStack gap="4">
        <Heading level="2" size="medium">
          Test autentisering
        </Heading>

        <HStack gap="4" wrap>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <VStack gap="2">
              <Button
                onClick={testUautentisertEndepunkt}
                loading={lasterUautentisert}
                variant="secondary"
              >
                Test uten autentisering
              </Button>

              {resultatUautentisert.status && (
                <Alert
                  variant={resultatUautentisert.status === "success" ? "success" : "error"}
                  size="small"
                >
                  <BodyShort>{resultatUautentisert.melding}</BodyShort>
                  {resultatUautentisert.data && (
                    <pre style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                      {JSON.stringify(resultatUautentisert.data, null, 2)}
                    </pre>
                  )}
                </Alert>
              )}
            </VStack>
          </div>

          <div style={{ flex: 1, minWidth: "300px" }}>
            <VStack gap="2">
              <Button
                onClick={testAutentisertEndepunkt}
                loading={lasterAutentisert}
                variant="primary"
              >
                Test med autentisering
              </Button>

              {resultatAutentisert.status && (
                <Alert
                  variant={resultatAutentisert.status === "success" ? "success" : "error"}
                  size="small"
                >
                  <BodyShort>{resultatAutentisert.melding}</BodyShort>
                  {resultatAutentisert.data && (
                    <pre style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                      {JSON.stringify(resultatAutentisert.data, null, 2)}
                    </pre>
                  )}
                </Alert>
              )}
            </VStack>
          </div>
        </HStack>

        <Alert variant="info" size="small">
          <BodyShort>
            <strong>Uautentisert:</strong> Skal fungere uten innlogging (permitAll)
          </BodyShort>
          <BodyShort>
            <strong>Autentisert:</strong> Krever gyldig JWT token via Oasis OBO exchange
          </BodyShort>
        </Alert>
      </VStack>
    </VStack>
  );
}
