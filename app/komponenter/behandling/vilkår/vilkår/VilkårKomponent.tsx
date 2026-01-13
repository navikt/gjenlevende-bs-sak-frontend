import {
  Heading,
  BodyLong,
  VStack,
  RadioGroup,
  Radio,
  Textarea,
  Button,
  HStack,
} from "@navikt/ds-react";
import React from "react";
import styles from "./VilkårKomponent.module.css";
import {
  CheckmarkCircleFillIcon,
  PencilIcon,
  TrashIcon,
  XMarkOctagonFillIcon,
} from "@navikt/aksel-icons";

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
}) => {
  const harSvaralternativOgBegrunnelse = spørsmålSvar !== "" && begrunnelse.trim() !== "";

  const handleLagreOgLås = () => {
    // TODO: Implementer lagring
    settLåst(true);
  };

  const handleKanRedigere = () => {
    settLåst(false);
  };

  const handleTilbakestillVilkår = () => {
    onChangeSpørsmål("");
    onChangeBegrunnelse("");
    settLåst(false);
  };

  const vilkårStatusIkon =
    spørsmålSvar === "ja" ? (
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
    <div className={styles.container}>
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
                >
                  Rediger
                </Button>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<TrashIcon title="slett" fontSize="1.5rem" />}
                  onClick={handleTilbakestillVilkår}
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
            readOnly={låst}
          >
            <Radio value="ja">Ja</Radio>
            <Radio value="nei">Nei</Radio>
          </RadioGroup>

          <Textarea
            label="Begrunnelse"
            onChange={(e) => onChangeBegrunnelse(e.target.value)}
            value={begrunnelse}
            readOnly={låst}
          />

          <div
            style={{
              height: "0.5rem",
            }}
          >
            {harSvaralternativOgBegrunnelse && !låst && (
              <Button onClick={handleLagreOgLås}>Lagre</Button>
            )}
          </div>
        </VStack>
      </div>
    </div>
  );
};

export default VilkårKomponent;
