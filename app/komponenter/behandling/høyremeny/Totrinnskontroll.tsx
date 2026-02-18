import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Heading,
  InlineMessage,
  Radio,
  RadioGroup,
  VStack,
} from "@navikt/ds-react";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useBeslutter } from "~/hooks/useBeslutter";
import { oppdaterEndringshistorikk } from "~/utils/endringshistorikkEvent";
import { InfoRad } from "./InfoRad";
import { TotrinnskontrollStatus } from "~/types/totrinnskontroll";

enum Totrinnsresultat {
  IKKE_VALGT = "IKKE_VALGT",
  GODKJENT = "GODKJENT",
  UNDERKJENT = "UNDERKJENT",
}

export const Totrinnskontroll = () => {
  const {
    behandling,
    revaliderBehandling,
    behandlingId,
    totrinnskontrollStatus,
    hentTotrinnskontrollStatusPåNytt,
    hentAnsvarligSaksbehandlerPåNytt,
  } = useBehandlingContext();
  const { angreSendTilBeslutter, besluttVedtak, sender } = useBeslutter();

  const erSendtTilBeslutter = behandling?.status === "FATTER_VEDTAK";

  if (
    !erSendtTilBeslutter &&
    totrinnskontrollStatus?.status !== TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT
  ) {
    return null;
  }

  if (totrinnskontrollStatus?.status === TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT) {
    return <TotrinnskontrollUnderkjent totrinnskontrollStatus={totrinnskontrollStatus} />;
  }

  if (totrinnskontrollStatus?.status === TotrinnskontrollStatus.KAN_FATTE_VEDTAK) {
    return (
      <FatterVedtak
        behandlingId={behandlingId}
        besluttVedtak={besluttVedtak}
        sender={sender}
        revaliderBehandling={revaliderBehandling}
        hentTotrinnskontrollStatusPåNytt={hentTotrinnskontrollStatusPåNytt}
        hentAnsvarligSaksbehandlerPåNytt={hentAnsvarligSaksbehandlerPåNytt}
      />
    );
  }

  if (totrinnskontrollStatus?.status === TotrinnskontrollStatus.IKKE_AUTORISERT) {
    return (
      <SendtTilBeslutter
        behandlingId={behandlingId}
        angreSendTilBeslutter={angreSendTilBeslutter}
        revaliderBehandling={revaliderBehandling}
        hentTotrinnskontrollStatusPåNytt={hentTotrinnskontrollStatusPåNytt}
        hentAnsvarligSaksbehandlerPåNytt={hentAnsvarligSaksbehandlerPåNytt}
        opprettetAv={totrinnskontrollStatus.totrinnskontroll?.opprettetAv}
        opprettetTid={totrinnskontrollStatus.totrinnskontroll?.opprettetTid}
      />
    );
  }

  return null;
};

const SendtTilBeslutter: React.FC<{
  behandlingId: string;
  angreSendTilBeslutter: (behandlingId: string) => Promise<{ data?: unknown }>;
  revaliderBehandling: () => void;
  hentTotrinnskontrollStatusPåNytt: () => void;
  hentAnsvarligSaksbehandlerPåNytt: () => void;
  opprettetAv?: string;
  opprettetTid?: string;
}> = ({
  behandlingId,
  angreSendTilBeslutter,
  revaliderBehandling,
  hentTotrinnskontrollStatusPåNytt,
  hentAnsvarligSaksbehandlerPåNytt,
  opprettetAv,
  opprettetTid,
}) => {
  const [laster, settLaster] = useState(false);

  const handleAngreSendTilBeslutter = async () => {
    settLaster(true);
    try {
      const respons = await angreSendTilBeslutter(behandlingId);
      if (respons.data) {
        oppdaterEndringshistorikk();
        revaliderBehandling();
        hentTotrinnskontrollStatusPåNytt();
        hentAnsvarligSaksbehandlerPåNytt();
      }
    } finally {
      settLaster(false);
    }
  };

  return (
    <Box borderColor="neutral" borderWidth="1" borderRadius="12" padding="space-16">
      <VStack gap="space-12">
        <Heading size="xsmall">Totrinnskontroll</Heading>
        <InlineMessage status="info" size="small">
          Vedtaket er sendt til godkjenning
        </InlineMessage>
        <VStack gap="space-4">
          <InfoRad label="Sendt inn av" verdi={opprettetAv || ""} />
          <InfoRad label="Sendt inn" verdi={opprettetTid || ""} />
        </VStack>
        <Button
          size="small"
          variant="secondary"
          onClick={handleAngreSendTilBeslutter}
          loading={laster}
        >
          Angre send til beslutter
        </Button>
      </VStack>
    </Box>
  );
};

const FatterVedtak: React.FC<{
  behandlingId: string;
  besluttVedtak: (
    behandlingId: string,
    data: { godkjent: boolean }
  ) => Promise<{ data?: unknown; feilmelding?: string }>;
  sender: boolean;
  revaliderBehandling: () => void;
  hentTotrinnskontrollStatusPåNytt: () => void;
  hentAnsvarligSaksbehandlerPåNytt: () => void;
}> = ({
  behandlingId,
  besluttVedtak,
  sender,
  revaliderBehandling,
  hentTotrinnskontrollStatusPåNytt,
  hentAnsvarligSaksbehandlerPåNytt,
}) => {
  const [totrinnsresultat, settTotrinnsresultat] = useState<Totrinnsresultat>(
    Totrinnsresultat.IKKE_VALGT
  );
  const [feilmelding, settFeilmelding] = useState<string | null>(null);

  const erUtfylt = totrinnsresultat !== Totrinnsresultat.IKKE_VALGT;

  const handleFullfør = async () => {
    settFeilmelding(null);
    const respons = await besluttVedtak(behandlingId, {
      godkjent: totrinnsresultat === Totrinnsresultat.GODKJENT,
    });

    if (respons.data) {
      oppdaterEndringshistorikk();
      revaliderBehandling();
      hentTotrinnskontrollStatusPåNytt();
      hentAnsvarligSaksbehandlerPåNytt();
    } else if (respons.feilmelding) {
      settFeilmelding(respons.feilmelding);
    }
  };

  return (
    <Box borderColor="neutral" borderWidth="1" borderRadius="12" padding="space-16">
      <VStack gap="space-12">
        <Heading size="xsmall">Totrinnskontroll</Heading>
        <RadioGroup
          legend="Beslutt vedtak"
          value={totrinnsresultat}
          onChange={(val) => settTotrinnsresultat(val as Totrinnsresultat)}
          size="small"
        >
          <Radio value={Totrinnsresultat.GODKJENT}>Godkjenn</Radio>
          <Radio value={Totrinnsresultat.UNDERKJENT}>Underkjenn</Radio>
        </RadioGroup>

        {erUtfylt && (
          <Button size="small" onClick={handleFullfør} loading={sender}>
            Fullfør
          </Button>
        )}

        {feilmelding && (
          <Alert variant="error" size="small">
            {feilmelding}
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

const TotrinnskontrollUnderkjent: React.FC<{
  totrinnskontrollStatus: {
    status: TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT;
    totrinnskontroll: {
      opprettetAv: string;
      opprettetTid: string;
    };
  };
}> = ({ totrinnskontrollStatus }) => {
  const { totrinnskontroll } = totrinnskontrollStatus;

  return (
    <Box borderColor="neutral" borderWidth="1" borderRadius="12" padding="space-16">
      <VStack gap="space-12">
        <Heading size="xsmall">Totrinnskontroll</Heading>
        <InlineMessage status="warning" size="small">
          Vedtaket er underkjent
        </InlineMessage>
        <VStack gap="space-4">
          <InfoRad label="Underkjent av" verdi={totrinnskontroll.opprettetAv} />
          <InfoRad label="Underkjent" verdi={totrinnskontroll.opprettetTid} />
        </VStack>
      </VStack>
    </Box>
  );
};
