import React from "react";
import { Button, InfoCard, InlineMessage, VStack } from "@navikt/ds-react";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useBeslutter } from "~/hooks/useBeslutter";
import { oppdaterEndringshistorikk } from "~/utils/endringshistorikkEvent";
import { InfoRad } from "./InfoRad";

export const Totrinnskontroll = () => {
  const { behandling, revaliderBehandling, behandlingId, ansvarligSaksbehandler } =
    useBehandlingContext();
  const { angreSendTilBeslutter } = useBeslutter();
  // TODO: Fyller inn med relevant info senere.
  const sendtInnAv = "";
  const sendtInnTidspunkt = "";
  const erSendtTilBeslutter = behandling?.status === "FATTER_VEDTAK";
  const erAnsvarligSaksbehandler = ansvarligSaksbehandler?.rolle === "INNLOGGET_SAKSBEHANDLER";

  const handleAngreSendTilBeslutter = async () => {
    const respons = await angreSendTilBeslutter(behandlingId);
    if (respons.data) {
      oppdaterEndringshistorikk();
      revaliderBehandling();
    }
  };

  if (!erSendtTilBeslutter) {
    return null;
  }

  return (
    <InfoCard data-color="info">
      <InfoCard.Header>
        <InfoCard.Title>Totrinnskontroll</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <VStack gap="space-16">
          <InlineMessage status="info" size="small">
            Vedtaket er sendt til godkjenning
          </InlineMessage>
          <VStack gap="space-4">
            <InfoRad label="Sendt inn av" verdi={sendtInnAv} />
            <InfoRad label="Sendt inn" verdi={sendtInnTidspunkt} />
          </VStack>
          <Button
            size="small"
            variant="secondary"
            onClick={handleAngreSendTilBeslutter}
            disabled={!erAnsvarligSaksbehandler}
          >
            Angre send til beslutter
          </Button>
        </VStack>
      </InfoCard.Content>
    </InfoCard>
  );
};
