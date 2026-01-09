import React from "react";
import VilkårKomponent from "./VilkårKomponent";

const INNGANGSVILKÅR_INNHOLD = {
  navn: "Inngangsvilkår",
  beskrivelse: [
    "[lenke til folketrygdloven § 17-2]",
    "[lenke til folketrygdloven § 17-3]",
    "[lenke til folketrygdloven § 17-4]",
  ],
  valgSpørsmål:
    "Fyller bruker inngangsvilkårene for ytelser til gjenlevende ektefelle? (§§17-2, 17-3 og 17-4)",
};

export const Inngangsvilkår: React.FC<{
  spørsmålSvar: string;
  settSpørsmålSvar: (val: string) => void;
  begrunnelse: string;
  settBegrunnelse: (val: string) => void;
}> = ({ begrunnelse, settBegrunnelse, spørsmålSvar, settSpørsmålSvar }) => {
  return (
    <VilkårKomponent
      navn={INNGANGSVILKÅR_INNHOLD.navn}
      beskrivelse={INNGANGSVILKÅR_INNHOLD.beskrivelse}
      valgSpørsmål={INNGANGSVILKÅR_INNHOLD.valgSpørsmål}
      spørsmålSvar={spørsmålSvar}
      onChangeSpørsmål={settSpørsmålSvar}
      begrunnelse={begrunnelse}
      onChangeBegrunnelse={settBegrunnelse}
    />
  );
};

export default Inngangsvilkår;
