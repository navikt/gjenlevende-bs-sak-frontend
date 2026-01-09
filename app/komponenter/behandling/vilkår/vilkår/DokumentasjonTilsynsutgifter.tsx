import React from "react";
import VilkårKomponent from "./VilkårKomponent";

const DOKUMENTASJON_TILSYNUTGIFTER_INNHOLD = {
  navn: "Dokumentasjon tilsynsutgifter",
  beskrivelse: [
    "Hvis bruker får kontantstøtte, skal dette beløpet trekkes fra den dokumenterte utgiften til barnepass.",
  ],
  valgSpørsmål: "Har brukeren dokumentert tilsynsutgifter?",
};

export const DokumentasjonTilsynsutgifter: React.FC<{
  spørsmålSvar: string;
  settSpørsmålSvar: (val: string) => void;
  begrunnelse: string;
  settBegrunnelse: (val: string) => void;
}> = ({ begrunnelse, settBegrunnelse, spørsmålSvar, settSpørsmålSvar }) => {
  return (
    <VilkårKomponent
      navn={DOKUMENTASJON_TILSYNUTGIFTER_INNHOLD.navn}
      beskrivelse={DOKUMENTASJON_TILSYNUTGIFTER_INNHOLD.beskrivelse}
      valgSpørsmål={DOKUMENTASJON_TILSYNUTGIFTER_INNHOLD.valgSpørsmål}
      spørsmålSvar={spørsmålSvar}
      onChangeSpørsmål={settSpørsmålSvar}
      begrunnelse={begrunnelse}
      onChangeBegrunnelse={settBegrunnelse}
    />
  );
};

export default DokumentasjonTilsynsutgifter;
