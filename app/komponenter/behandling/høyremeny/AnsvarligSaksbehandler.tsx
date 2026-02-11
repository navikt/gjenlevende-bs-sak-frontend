import React from "react";
import { InfoCard, VStack, Heading, HStack, BodyShort, Skeleton } from "@navikt/ds-react";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useHentAnsvarligSaksbehandler } from "~/hooks/useHentAnsvarligSaksbehandler";
import { formatterEnumVerdi, formaterIsoDatoTid } from "~/utils/utils";


const rolleDataColor = {
  INNLOGGET_SAKSBEHANDLER: "success",
  ANNEN_SAKSBEHANDLER: "warning",
  IKKE_SATT: "neutral",
} as const;

export const AnsvarligSaksbehandler = () => {
  const { behandling } = useBehandlingContext();
  const { ansvarligSaksbehandler, laster } = useHentAnsvarligSaksbehandler(behandling?.id);

  const dataColor = ansvarligSaksbehandler
    ? rolleDataColor[ansvarligSaksbehandler.rolle]
    : ("neutral" as const);

  const visningNavn = ansvarligSaksbehandler
    ? ansvarligSaksbehandler.rolle === "IKKE_SATT"
      ? "Ikke tildelt"
      : `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`
    : null;

  return (
    <InfoCard data-color={dataColor}>
      <InfoCard.Header>
        <InfoCard.Title>Ansvarlig saksbehandler</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <VStack gap={"space-16"}>
          {laster ? (
            <Skeleton variant="text" width="60%" />
          ) : (
            <Heading size={"xsmall"}>{visningNavn ?? "-"}</Heading>
          )}

          <VStack gap={"space-6"}>
            <HStack gap="space-6" align="center" justify="space-between">
              <BodyShort size={"small"} weight={"semibold"}>
                Behandlingstatus
              </BodyShort>
              <BodyShort size={"small"}>
                {behandling ? formatterEnumVerdi(behandling.status) : "-"}
              </BodyShort>
            </HStack>

            <HStack gap="space-6" align="center" justify="space-between">
              <BodyShort size={"small"} weight={"semibold"}>
                Behandlingresultat
              </BodyShort>
              <BodyShort size={"small"}>
                {behandling ? formatterEnumVerdi(behandling.resultat) : "-"}
              </BodyShort>
            </HStack>

            <HStack gap="space-6" align="center" justify="space-between">
              <BodyShort size={"small"} weight={"semibold"}>
                Opprettet
              </BodyShort>
              <BodyShort size={"small"}>
                {behandling ? formaterIsoDatoTid(behandling.opprettet) : "-"}
              </BodyShort>
            </HStack>

            <HStack gap="space-6" align="center" justify="space-between">
              <BodyShort size={"small"} weight={"semibold"}>
                Sist endret
              </BodyShort>
              <BodyShort size={"small"}>
                {behandling ? formaterIsoDatoTid(behandling.sistEndret) : "-"}
              </BodyShort>
            </HStack>
          </VStack>
        </VStack>
      </InfoCard.Content>
    </InfoCard>
  );
};
