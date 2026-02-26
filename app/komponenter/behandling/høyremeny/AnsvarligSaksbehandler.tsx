import React from "react";
import { InfoCard, VStack, Heading, Skeleton } from "@navikt/ds-react";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { formatterEnumVerdi, formaterIsoDatoTid } from "~/utils/utils";
import { InfoRad } from "./InfoRad";

const rolleDataColor = {
  INNLOGGET_SAKSBEHANDLER: "success",
  ANNEN_SAKSBEHANDLER: "warning",
  IKKE_SATT: "neutral",
} as const;

export const AnsvarligSaksbehandler = () => {
  const { behandling, ansvarligSaksbehandler, lasterAnsvarligSaksbehandler } =
    useBehandlingContext();

  const dataColor = ansvarligSaksbehandler
    ? rolleDataColor[ansvarligSaksbehandler.rolle]
    : ("neutral" as const);

  const visningNavn = ansvarligSaksbehandler
    ? ansvarligSaksbehandler.rolle === "IKKE_SATT"
      ? "Ikke tildelt"
      : `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`
    : null;

  const erBehandlingFerdigstilt = behandling?.status === "FERDIGSTILT";

  if (erBehandlingFerdigstilt) {
    return null;
  }

  return (
    <InfoCard data-color={dataColor}>
      <InfoCard.Header>
        <InfoCard.Title>Ansvarlig saksbehandler</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <VStack gap={"space-16"}>
          {lasterAnsvarligSaksbehandler ? (
            <Skeleton variant="text" width="60%" />
          ) : (
            <Heading size={"xsmall"}>{visningNavn ?? "-"}</Heading>
          )}

          <VStack gap={"space-6"}>
            <InfoRad
              label="Behandlingstatus"
              verdi={behandling ? formatterEnumVerdi(behandling.status) : "-"}
            />
            <InfoRad
              label="Behandlingresultat"
              verdi={behandling ? formatterEnumVerdi(behandling.resultat) : "-"}
            />
            <InfoRad
              label="Opprettet"
              verdi={behandling ? formaterIsoDatoTid(behandling.opprettet) : "-"}
            />
            <InfoRad
              label="Sist endret"
              verdi={behandling ? formaterIsoDatoTid(behandling.sistEndret) : "-"}
            />
            <InfoRad label="Endret av" verdi={behandling?.sistEndretAv ?? "-"} />
          </VStack>
        </VStack>
      </InfoCard.Content>
    </InfoCard>
  );
};
