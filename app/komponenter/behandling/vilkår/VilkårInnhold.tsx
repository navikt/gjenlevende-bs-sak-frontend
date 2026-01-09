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
}

export const VilkårInnhold: React.FC<{
  settErVilkårUtfylt: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ settErVilkårUtfylt }) => {
  const [inngangsvilkår, settInngangsvilkår] = useState<VilkårState>({
    spørsmålSvar: "",
    begrunnelse: "",
  });

  const [aktivitet, settAktivitet] = useState<VilkårState>({
    spørsmålSvar: "",
    begrunnelse: "",
  });

  const [inntekt, settInntekt] = useState<VilkårState>({
    spørsmålSvar: "",
    begrunnelse: "",
  });

  const [alderPåBarn, settAlderPåBarn] = useState<VilkårState>({
    spørsmålSvar: "",
    begrunnelse: "",
  });

  const [dokumentasjonTilsynsutgifter, settDokumentasjonTilsynsutgifter] = useState<VilkårState>({
    spørsmålSvar: "",
    begrunnelse: "",
  });

  const sjekkOmSpørsmålHarSvar = (val: string) => val !== "";

  const alleVilkårHarSvar = useMemo(() => {
    return (
      sjekkOmSpørsmålHarSvar(inngangsvilkår.spørsmålSvar) &&
      sjekkOmSpørsmålHarSvar(aktivitet.spørsmålSvar) &&
      sjekkOmSpørsmålHarSvar(inntekt.spørsmålSvar) &&
      sjekkOmSpørsmålHarSvar(alderPåBarn.spørsmålSvar) &&
      sjekkOmSpørsmålHarSvar(dokumentasjonTilsynsutgifter.spørsmålSvar)
    );
  }, [
    inngangsvilkår.spørsmålSvar,
    aktivitet.spørsmålSvar,
    inntekt.spørsmålSvar,
    alderPåBarn.spørsmålSvar,
    dokumentasjonTilsynsutgifter.spørsmålSvar,
  ]);

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
      />

      <Aktivitet
        spørsmålSvar={aktivitet.spørsmålSvar}
        settSpørsmålSvar={(val) => settAktivitet((prev) => ({ ...prev, spørsmålSvar: val }))}
        begrunnelse={aktivitet.begrunnelse}
        settBegrunnelse={(val) => settAktivitet((prev) => ({ ...prev, begrunnelse: val }))}
      />

      <Inntekt
        spørsmålSvar={inntekt.spørsmålSvar}
        settSpørsmålSvar={(val) => settInntekt((prev) => ({ ...prev, spørsmålSvar: val }))}
        begrunnelse={inntekt.begrunnelse}
        settBegrunnelse={(val) => settInntekt((prev) => ({ ...prev, begrunnelse: val }))}
      />

      <AlderPåBarn
        spørsmålSvar={alderPåBarn.spørsmålSvar}
        settSpørsmålSvar={(val) => settAlderPåBarn((prev) => ({ ...prev, spørsmålSvar: val }))}
        begrunnelse={alderPåBarn.begrunnelse}
        settBegrunnelse={(val) => settAlderPåBarn((prev) => ({ ...prev, begrunnelse: val }))}
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
      />
    </VStack>
  );
};

export default VilkårInnhold;
