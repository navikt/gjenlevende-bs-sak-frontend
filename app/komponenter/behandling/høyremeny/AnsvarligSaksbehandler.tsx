import React from "react";
import { InfoCard, VStack, Heading, HStack, BodyShort, Skeleton } from "@navikt/ds-react";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useHentSaksbehandler } from "~/hooks/useHentSaksbehandler";
import { formatterEnumVerdi, formaterIsoDatoTid } from "~/utils/utils";

export const AnsvarligSaksbehandler = () => {
  const { behandling } = useBehandlingContext();
  const { visningNavn, laster } = useHentSaksbehandler(behandling?.opprettetAv);

  return (
    <InfoCard data-color={"success"}>
      <InfoCard.Header>
        <InfoCard.Title>Ansvarlig saksbehandler</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <VStack gap={"space-16"}>
          {laster ? (
            <Skeleton variant="text" width="60%" />
          ) : (
            <Heading size={"xsmall"}>{visningNavn ?? behandling?.opprettetAv}</Heading>
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
