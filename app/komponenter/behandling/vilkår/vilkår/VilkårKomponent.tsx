import {
  Heading,
  BodyLong,
  VStack,
  RadioGroup,
  Radio,
  Textarea,
  Button,
  HStack,
  Box,
} from "@navikt/ds-react";
import React from "react";
import styles from "./VilkårKomponent.module.css";
import {
  CheckmarkCircleFillIcon,
  PencilIcon,
  TrashIcon,
  XMarkOctagonFillIcon,
} from "@navikt/aksel-icons";
import { Vurdering } from "~/types/vilkår";
import { useErLesevisning } from "~/hooks/useErLesevisning";

export const VilkårKomponent: React.FC<{
  navn: string;
  beskrivelse: string[];
  valgSpørsmål: string;
  spørsmålSvar: string;
  onChangeSpørsmål: (val: string) => void;
  begrunnelse: string;
  onChangeBegrunnelse: (val: string) => void;
  låst: boolean;
  settLåst: (val: boolean) => void;
  lagrer: boolean;
  onLagre: () => Promise<boolean>;
  onSlett: () => void;
}> = ({
  navn,
  beskrivelse,
  valgSpørsmål,
  spørsmålSvar,
  onChangeSpørsmål,
  begrunnelse,
  onChangeBegrunnelse,
  låst,
  settLåst,
  lagrer = false,
  onLagre,
  onSlett,
}) => {
  const erLesevisning = useErLesevisning();
  const erLåstEllerVisningsmodus = låst || !erLesevisning;

  const harSvaralternativOgBegrunnelse = spørsmålSvar !== "" && begrunnelse.trim() !== "";

  const handleLagreOgLås = async () => {
    if (onLagre) {
      await onLagre();
    } else {
      settLåst(true);
    }
  };

  const handleKanRedigere = () => {
    settLåst(false);
  };

  const handleTilbakestillVilkår = () => {
    onSlett();
  };

  const vilkårStatusIkon =
    spørsmålSvar === Vurdering.JA ? (
      <CheckmarkCircleFillIcon
        title="vilkår oppfylt"
        fontSize="1.5rem"
        color="var(--a-icon-success)"
      />
    ) : (
      <XMarkOctagonFillIcon
        title="vilkår ikke oppfylt"
        fontSize="1.5rem"
        color="var(--a-icon-danger)"
      />
    );

  return (
    <Box
      className={styles.container}
      shadow="small"
      background="surface-subtle"
      padding="space-16"
      borderRadius="large"
    >
      <div className={styles.venstreKolonne}>
        <Heading size="small">{navn}</Heading>
        {beskrivelse.map((tekst, index) => (
          <BodyLong size="small" key={index}>
            {tekst}
          </BodyLong>
        ))}
      </div>

      <div className={styles.høyreKolonne}>
        <VStack gap="6">
          {låst && (
            <HStack gap="6" align="center">
              <HStack gap="2">
                <Heading size="small">Vilkår oppfylt</Heading>
                {vilkårStatusIkon}
              </HStack>

              <HStack gap="2">
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<PencilIcon title="Rediger" />}
                  onClick={handleKanRedigere}
                  disabled={!erLesevisning}
                >
                  Rediger
                </Button>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<TrashIcon title="slett" fontSize="1.5rem" />}
                  onClick={handleTilbakestillVilkår}
                  disabled={!erLesevisning}
                >
                  Slett
                </Button>
              </HStack>
            </HStack>
          )}

          <RadioGroup
            legend={valgSpørsmål}
            onChange={onChangeSpørsmål}
            value={spørsmålSvar}
            readOnly={erLåstEllerVisningsmodus}
          >
            <Radio value="JA">Ja</Radio>
            <Radio value="NEI">Nei</Radio>
          </RadioGroup>

          <Textarea
            label="Begrunnelse"
            onChange={(e) => onChangeBegrunnelse(e.target.value)}
            value={begrunnelse}
            readOnly={erLåstEllerVisningsmodus}
          />

          <div>
            <Button
              onClick={handleLagreOgLås}
              disabled={!harSvaralternativOgBegrunnelse || erLåstEllerVisningsmodus}
              loading={lagrer}
            >
              Lagre
            </Button>
          </div>
        </VStack>
      </div>
    </Box>
  );
};

export default VilkårKomponent;
