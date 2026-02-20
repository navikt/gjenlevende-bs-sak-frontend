import { Button, Heading, Select, VStack } from "@navikt/ds-react";
import React from "react";
import { Fritekstbolk } from "~/komponenter/brev/Fritekstbolk";
import { PlusIcon } from "@navikt/aksel-icons";
import { PdfForhåndsvisning } from "~/komponenter/brev/PdfForhåndsvisning";
import { brevmaler } from "~/komponenter/brev/brevmaler";
import { useErLesevisning } from "~/hooks/useErLesevisning";
import type { Brevmal, Tekstbolk } from "~/komponenter/brev/typer";
import styles from "~/komponenter/brev/BrevSide.module.css";

interface Props {
  brevMal: Brevmal | null;
  fritekstbolker: Tekstbolk[];
  velgBrevmal: (brevmal: string) => void;
  leggTilFritekstbolk: () => void;
  flyttBolkOpp: (index: number) => void;
  flyttBolkNed: (index: number) => void;
  oppdaterFelt: (index: number, partial: Partial<Tekstbolk>) => void;
  slettFritekstbolk: (index: number) => void;
}

export const BrevSide = ({
  brevMal,
  fritekstbolker,
  velgBrevmal,
  leggTilFritekstbolk,
  flyttBolkOpp,
  flyttBolkNed,
  oppdaterFelt,
  slettFritekstbolk,
}: Props) => {
  const erLesevisning = useErLesevisning();

  return (
    <VStack gap="space-8">
      <Select
        label="Velg dokument"
        value={brevMal?.tittel ?? ""}
        onChange={(e) => velgBrevmal(e.target.value)}
        size="small"
        disabled={erLesevisning}
        style={{ maxWidth: "400px" }}
      >
        <option value="" disabled>
          Ikke valgt
        </option>
        {brevmaler.map((brevmal) => (
          <option key={brevmal.tittel} value={brevmal.tittel}>
            {brevmal.tittel}
          </option>
        ))}
      </Select>

      {brevMal && (
        <div className={styles.innholdGrid}>
          <VStack gap="space-4">
            <Heading level="3" size="small">
              Fritekstområde
            </Heading>
            {fritekstbolker.map((fritekstfelt, index) => (
              <Fritekstbolk
                key={index}
                underoverskrift={fritekstfelt.underoverskrift}
                innhold={fritekstfelt.innhold}
                handleOppdaterFelt={(partial) => oppdaterFelt(index, partial)}
                handleFlyttOpp={() => flyttBolkOpp(index)}
                handleFlyttNed={() => flyttBolkNed(index)}
                handleSlett={() => slettFritekstbolk(index)}
                fritekstfeltListe={fritekstbolker}
              />
            ))}
            <Button
              variant="tertiary"
              icon={<PlusIcon title="Legg til fritekstfelt" />}
              onClick={leggTilFritekstbolk}
              disabled={erLesevisning}
            >
              Legg til fritekstfelt
            </Button>
          </VStack>

          <div className={styles.pdfContainer}>
            <PdfForhåndsvisning brevmal={brevMal} fritekstbolker={fritekstbolker} />
          </div>
        </div>
      )}
    </VStack>
  );
};
