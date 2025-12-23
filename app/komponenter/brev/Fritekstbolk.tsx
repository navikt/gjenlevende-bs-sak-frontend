import { Button, HStack, Textarea, TextField, VStack } from "@navikt/ds-react";
import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@navikt/aksel-icons";
import type { Tekstbolk } from "~/komponenter/brev/typer";

interface Props {
  underoverskrift?: string;
  innhold: string;
  handleOppdaterFelt: (value: Partial<{ underoverskrift: string; innhold: string }>) => void;
  handleFlyttOpp: () => void;
  handleFlyttNed: () => void;
  fritekstfeltListe: Tekstbolk[];
}

export const Fritekstbolk = ({
  underoverskrift,
  innhold,
  handleOppdaterFelt,
  handleFlyttOpp,
  handleFlyttNed,
  fritekstfeltListe,
}: Props) => {
  return (
    <VStack
      gap={"2"}
      padding={"4"}
      style={{
        border: "1px solid var(--a-border-default)",
      }}
    >
      <TextField
        label="Deloverskrift"
        value={underoverskrift}
        onChange={(e) => handleOppdaterFelt({ underoverskrift: e.target.value })}
        size={"small"}
      />
      <Textarea
        label="Innhold"
        value={innhold}
        onChange={(e) => handleOppdaterFelt({ innhold: e.target.value })}
        size={"small"}
      />
      {fritekstfeltListe.length > 1 && (
        <HStack justify={"end"}>
          <Button
            variant={"tertiary"}
            icon={<ArrowDownIcon />}
            onClick={handleFlyttNed}
            size={"small"}
          />
          <Button
            variant={"tertiary"}
            icon={<ArrowUpIcon />}
            onClick={handleFlyttOpp}
            size={"small"}
          />
        </HStack>
      )}
    </VStack>
  );
};
