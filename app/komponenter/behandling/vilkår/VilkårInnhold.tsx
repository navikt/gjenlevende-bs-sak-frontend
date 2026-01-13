import React, { useEffect, useMemo, useState } from "react";
import { VStack } from "@navikt/ds-react";
import Inngangsvilkår from "./vilkår/Inngangsvilkår";
import Aktivitet from "./vilkår/Aktivitet";
import Inntekt from "./vilkår/Inntekt";
import AlderPåBarn from "./vilkår/AlderPåBarn";
import DokumentasjonTilsynsutgifter from "./vilkår/DokumentasjonTilsynsutgifter";

interface VilkårState {
  spørsmålSvar: string;
  begrunnelse: string;
  låst: boolean;
}

const initialVilkårState: VilkårState = {
  spørsmålSvar: "",
  begrunnelse: "",
  låst: false,
};

export const VilkårInnhold: React.FC<{
  settErVilkårUtfylt: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ settErVilkårUtfylt }) => {
  const [inngangsvilkår, settInngangsvilkår] = useState<VilkårState>(initialVilkårState);

  const [aktivitet, settAktivitet] = useState<VilkårState>(initialVilkårState);

  const [inntekt, settInntekt] = useState<VilkårState>(initialVilkårState);

  const [alderPåBarn, settAlderPåBarn] = useState<VilkårState>(initialVilkårState);

  const [dokumentasjonTilsynsutgifter, settDokumentasjonTilsynsutgifter] =
    useState<VilkårState>(initialVilkårState);

  const alleVilkårHarSvar = useMemo(() => {
    const sjekkOmVilkårHarSvarOgBegrunnelse = (vilkår: VilkårState) => {
      return vilkår.spørsmålSvar !== "" && vilkår.begrunnelse.trim() !== "";
    };

    const sjekkOmVilkårErLåst = (vilkår: VilkårState) => {
      return vilkår.låst;
    };

    const sjekkOmVilkårErFerdigUtfylt = (vilkår: VilkårState) => {
      return sjekkOmVilkårHarSvarOgBegrunnelse(vilkår) && sjekkOmVilkårErLåst(vilkår);
    };

    return (
      sjekkOmVilkårErFerdigUtfylt(inngangsvilkår) &&
      sjekkOmVilkårErFerdigUtfylt(aktivitet) &&
      sjekkOmVilkårErFerdigUtfylt(inntekt) &&
      sjekkOmVilkårErFerdigUtfylt(alderPåBarn) &&
      sjekkOmVilkårErFerdigUtfylt(dokumentasjonTilsynsutgifter)
    );
  }, [inngangsvilkår, aktivitet, inntekt, alderPåBarn, dokumentasjonTilsynsutgifter]);

  useEffect(() => {
    settErVilkårUtfylt(alleVilkårHarSvar);
  }, [alleVilkårHarSvar, settErVilkårUtfylt]);

  return (
    <VStack gap="16">
      <Inngangsvilkår
        spørsmålSvar={inngangsvilkår.spørsmålSvar}
        settSpørsmålSvar={(val) => settInngangsvilkår((prev) => ({ ...prev, spørsmålSvar: val }))}
        begrunnelse={inngangsvilkår.begrunnelse}
        settBegrunnelse={(val) => settInngangsvilkår((prev) => ({ ...prev, begrunnelse: val }))}
        låst={inngangsvilkår.låst}
        settLåst={(val) => settInngangsvilkår((prev) => ({ ...prev, låst: val }))}
      />

      <Aktivitet
        spørsmålSvar={aktivitet.spørsmålSvar}
        settSpørsmålSvar={(val) => settAktivitet((prev) => ({ ...prev, spørsmålSvar: val }))}
        begrunnelse={aktivitet.begrunnelse}
        settBegrunnelse={(val) => settAktivitet((prev) => ({ ...prev, begrunnelse: val }))}
        låst={aktivitet.låst}
        settLåst={(val) => settAktivitet((prev) => ({ ...prev, låst: val }))}
      />

      <Inntekt
        spørsmålSvar={inntekt.spørsmålSvar}
        settSpørsmålSvar={(val) => settInntekt((prev) => ({ ...prev, spørsmålSvar: val }))}
        begrunnelse={inntekt.begrunnelse}
        settBegrunnelse={(val) => settInntekt((prev) => ({ ...prev, begrunnelse: val }))}
        låst={inntekt.låst}
        settLåst={(val) => settInntekt((prev) => ({ ...prev, låst: val }))}
      />

      <AlderPåBarn
        spørsmålSvar={alderPåBarn.spørsmålSvar}
        settSpørsmålSvar={(val) => settAlderPåBarn((prev) => ({ ...prev, spørsmålSvar: val }))}
        begrunnelse={alderPåBarn.begrunnelse}
        settBegrunnelse={(val) => settAlderPåBarn((prev) => ({ ...prev, begrunnelse: val }))}
        låst={alderPåBarn.låst}
        settLåst={(val) => settAlderPåBarn((prev) => ({ ...prev, låst: val }))}
      />

      <DokumentasjonTilsynsutgifter
        spørsmålSvar={dokumentasjonTilsynsutgifter.spørsmålSvar}
        settSpørsmålSvar={(val) =>
          settDokumentasjonTilsynsutgifter((prev) => ({ ...prev, spørsmålSvar: val }))
        }
        begrunnelse={dokumentasjonTilsynsutgifter.begrunnelse}
        settBegrunnelse={(val) =>
          settDokumentasjonTilsynsutgifter((prev) => ({ ...prev, begrunnelse: val }))
        }
        låst={dokumentasjonTilsynsutgifter.låst}
        settLåst={(val) => settDokumentasjonTilsynsutgifter((prev) => ({ ...prev, låst: val }))}
      />
    </VStack>
  );
};

export default VilkårInnhold;
