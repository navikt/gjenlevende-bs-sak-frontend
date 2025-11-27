import React from "react";
import styles from "./Personheader.module.css";
import { PersonIcon } from "@navikt/aksel-icons";
import { BodyShort, CopyButton, HStack } from "@navikt/ds-react";
import { usePersonContext } from "~/contexts/PersonContext";
import { formaterNavn } from "~/utils/utils";

export const Personheader = () => {
  const context = usePersonContext();
  const { navn, fødselsnummer } = context;

  return (
    <ul className={styles.ul}>
      <li className={styles.li}>
        <PersonIcon title="person" fontSize="1.5rem" />
      </li>
      <li className={styles.li}>
        <BodyShort weight="semibold">{formaterNavn(navn)}</BodyShort>
      </li>
      <li className={styles.li}>
        <HStack align="center">
          {fødselsnummer}
          <CopyButton copyText={fødselsnummer} size="small" />
        </HStack>
      </li>
    </ul>
  );
};

export default Personheader;
