import React, { type ReactNode } from "react";
import styles from "./Personheader.module.css";
import { PersonIcon } from "@navikt/aksel-icons";
import { BodyShort, CopyButton, HStack, Link } from "@navikt/ds-react";
import { usePersonContext } from "~/contexts/PersonContext";
import { formaterNavn } from "~/utils/utils";

type PersonheaderProps = {
  children?: ReactNode;
};

export const Personheader = ({ children }: PersonheaderProps) => {
  const context = usePersonContext();
  const { navn, personident, fagsakPersonId } = context;
  const visningsNavn = navn ? formaterNavn(navn) : "Navn ikke tilgjengelig";

  return (
    <div className={styles.personheader}>
      <HStack align="center" gap="space-4" className={styles.personInfo}>
        <HStack gap="space-2" align="center">
          <PersonIcon title="person" fontSize="1.5rem" />
          <BodyShort weight="semibold">
            <Link href={`/person/${fagsakPersonId}/behandlingsoversikt`}>{visningsNavn}</Link>
          </BodyShort>
        </HStack>

        <HStack align="center">
          {personident || "Personident ikke tilgjengelig"}
          {personident && <CopyButton copyText={personident} size="small" />}
        </HStack>
      </HStack>

      {children && (
        <>
          <div className={styles.divider} />
          {children}
        </>
      )}
    </div>
  );
};

export default Personheader;
