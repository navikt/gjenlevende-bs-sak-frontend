import { Heading, BodyLong, VStack, RadioGroup, Radio, Textarea } from "@navikt/ds-react";
import React from "react";
import styles from "./VilkårKomponent.module.css";

export const VilkårKomponent: React.FC<{
  navn: string;
  beskrivelse: string[];
  valgSpørsmål: string;
  spørsmålSvar: string;
  onChangeSpørsmål: (val: string) => void;
  begrunnelse: string;
  onChangeBegrunnelse: (val: string) => void;
}> = ({
  navn,
  beskrivelse,
  valgSpørsmål,
  spørsmålSvar,
  onChangeSpørsmål,
  begrunnelse,
  onChangeBegrunnelse,
}) => {
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
          <RadioGroup legend={valgSpørsmål} onChange={onChangeSpørsmål} value={spørsmålSvar}>
            <Radio value="ja">Ja</Radio>
            <Radio value="nei">Nei</Radio>
          </RadioGroup>
          <Textarea
            label="Begrunnelse"
            onChange={(e) => onChangeBegrunnelse(e.target.value)}
            value={begrunnelse}
          />
        </VStack>
      </div>
    </div>
  );
};

export default VilkårKomponent;
