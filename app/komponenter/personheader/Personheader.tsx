import React from "react";
import styles from "./Personheader.module.css";
import { PersonIcon } from "@navikt/aksel-icons";
import { BodyShort, CopyButton, HStack, Link } from "@navikt/ds-react";
import { usePersonContext } from "~/contexts/PersonContext";
import { formaterNavn } from "~/utils/utils";

export const Personheader = () => {
  const context = usePersonContext();
  const { navn, personident, fagsakPersonId } = context;
  const visningsNavn = navn ? formaterNavn(navn) : "Navn ikke tilgjengelig";

  return (
    <ul className={styles.ul}>
      <li className={styles.li}>
        <HStack gap="2">
          <PersonIcon title="person" fontSize="1.5rem" />
          <BodyShort weight="semibold">
            <Link href={`/person/${fagsakPersonId}/behandlingsoversikt`}>{visningsNavn}</Link>
          </BodyShort>
        </HStack>
      </li>

      <li className={styles.li}>
        <HStack align="center">
          {personident || "Personident ikke tilgjengelig"}
          {personident && <CopyButton copyText={personident} size="small" />}
        </HStack>
      </li>
    </ul>
  );
};

export default Personheader;
