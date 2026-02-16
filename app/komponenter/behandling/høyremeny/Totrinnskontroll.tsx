import React from "react";
import { Box, Button, Heading, HStack, InlineMessage, VStack } from "@navikt/ds-react";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useBeslutter } from "~/hooks/useBeslutter";
import { InfoRad } from "./InfoRad";

export const Totrinnskontroll = () => {
  const { behandling, revaliderBehandling, behandlingId } = useBehandlingContext();
  const { angreSendTilBeslutter } = useBeslutter();
  // TODO: Fyller inn med relevant info senere.
  const sendtInnAv = "";
  const sendtInnTidspunkt = "";
  const erSendtTilBeslutter = behandling?.status === "FATTER_VEDTAK";

  const handleAngreSendTilBeslutter = async () => {
    const respons = await angreSendTilBeslutter(behandlingId);
    if (respons.data) {
      revaliderBehandling();
    }
  };

  if (!erSendtTilBeslutter) {
    return null;
  }

  return (
    <Box borderColor="neutral" borderWidth="1" borderRadius="12" padding="space-16">
      <HStack gap={"space-24"}>
        <HStack gap="space-12" align="center" justify="space-between">
          <Heading size={"xsmall"}>Totrinnskontroll</Heading>

          <InlineMessage status="info" size="small">
            Vedtaket er sendt til godkjenning
          </InlineMessage>

          <VStack gap={"space-4"}>
            <InfoRad label={"Sendt inn av"} verdi={sendtInnAv}></InfoRad>

            <InfoRad label={"Sendt inn"} verdi={sendtInnTidspunkt}></InfoRad>
          </VStack>
        </HStack>
        <Button size="small" variant="secondary" onClick={handleAngreSendTilBeslutter}>
          Angre send til beslutter
        </Button>
      </HStack>
    </Box>
  );
};
