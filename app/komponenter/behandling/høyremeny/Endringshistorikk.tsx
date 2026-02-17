import React from "react";
import { BodyShort, Detail, Skeleton, Tag, Tooltip, VStack } from "@navikt/ds-react";
import {
  PlusCircleIcon,
  PaperplaneIcon,
  ArrowUndoIcon,
  TasklistIcon,
  CheckmarkCircleIcon,
  DocPencilIcon,
  NotePencilIcon,
} from "@navikt/aksel-icons";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useHentEndringshistorikk } from "~/hooks/useHentEndringshistorikk";
import { formaterIsoDatoTid } from "~/utils/utils";
import type { EndringType, BehandlingEndring } from "~/types/endringshistorikk";
import styles from "./Endringshistorikk.module.css";

type TagColor = "info" | "success" | "warning" | "danger" | "neutral";

interface EndringMeta {
  tekst: string;
  ikon: React.ElementType;
  farge: TagColor;
  erMilstein: boolean;
}

const endringMeta: Record<EndringType, EndringMeta> = {
  BEHANDLING_OPPRETTET: {
    tekst: "Behandling opprettet",
    ikon: PlusCircleIcon,
    farge: "success",
    erMilstein: true,
  },
  SENDT_TIL_BESLUTTER: {
    tekst: "Sendt til beslutter",
    ikon: PaperplaneIcon,
    farge: "info",
    erMilstein: true,
  },
  ANGRET_SEND_TIL_BESLUTTER: {
    tekst: "Angret send til beslutter",
    ikon: ArrowUndoIcon,
    farge: "warning",
    erMilstein: true,
  },
  VILKÅR_VURDERING_OPPRETTET: {
    tekst: "Vilkår opprettet",
    ikon: TasklistIcon,
    farge: "info",
    erMilstein: false,
  },
  VILKÅR_VURDERING_OPPDATERT: {
    tekst: "Vilkår oppdatert",
    ikon: TasklistIcon,
    farge: "info",
    erMilstein: false,
  },
  VEDTAK_LAGRET: {
    tekst: "Vedtak lagret",
    ikon: CheckmarkCircleIcon,
    farge: "success",
    erMilstein: false,
  },
  BREV_PDF_GENERERT: {
    tekst: "Brev PDF generert",
    ikon: DocPencilIcon,
    farge: "neutral",
    erMilstein: false,
  },
  ÅRSAK_LAGRET: {
    tekst: "Årsak lagret",
    ikon: NotePencilIcon,
    farge: "info",
    erMilstein: false,
  },
  ÅRSAK_OPPDATERT: {
    tekst: "Årsak oppdatert",
    ikon: NotePencilIcon,
    farge: "info",
    erMilstein: false,
  },
  BESLUTTER_GODKJENT: {
    tekst: "Beslutter godkjent",
    ikon: CheckmarkCircleIcon,
    farge: "success",
    erMilstein: true,
  },
};

const formaterRelativTid = (isoTid: string): string => {
  const tid = new Date(isoTid);
  const nå = new Date();
  const diffSekunder = Math.floor((nå.getTime() - tid.getTime()) / 1000);

  if (diffSekunder < 60) return "Akkurat nå";
  if (diffSekunder < 3600) return `${Math.floor(diffSekunder / 60)} min. siden`;
  if (diffSekunder < 86400) return `${Math.floor(diffSekunder / 3600)} t. siden`;
  if (diffSekunder < 604800) return `${Math.floor(diffSekunder / 86400)} d. siden`;
  return formaterIsoDatoTid(isoTid);
};

interface EndringGruppe {
  utførtAv: string;
  endringer: BehandlingEndring[];
}

const grupperKonsekutiveEndringer = (endringer: BehandlingEndring[]): EndringGruppe[] => {
  const grupper: EndringGruppe[] = [];

  for (const endring of endringer) {
    const sisteGruppe = grupper[grupper.length - 1];

    if (sisteGruppe && sisteGruppe.utførtAv === endring.utførtAv) {
      sisteGruppe.endringer.push(endring);
    } else {
      grupper.push({ utførtAv: endring.utførtAv, endringer: [endring] });
    }
  }

  return grupper;
};

const EndringRad = ({ endring }: { endring: BehandlingEndring }) => {
  const meta = endringMeta[endring.endringType];
  const Ikon = meta.ikon;

  return (
    <div className={styles.endringRad}>
      <div className={`${styles.tidslinjePunkt} ${styles[`punkt_${meta.farge}`]}`} />
      <div className={styles.endringInnhold}>
        <div className={styles.endringTittel}>
          <Ikon className={`${styles.endringIkon} ${styles[`ikon_${meta.farge}`]}`} aria-hidden />
          <BodyShort size="small" weight="semibold">
            {meta.tekst}
          </BodyShort>
        </div>
        {meta.erMilstein && (
          <Tag variant="moderate" size="xsmall" data-color={meta.farge}>
            {meta.tekst}
          </Tag>
        )}
        {endring.detaljer && (
          <Detail textColor="subtle">{endring.detaljer}</Detail>
        )}
        <Tooltip content={formaterIsoDatoTid(endring.utførtTid)} placement="left">
          <Detail textColor="subtle" className={styles.tidspunkt}>
            {formaterRelativTid(endring.utførtTid)}
          </Detail>
        </Tooltip>
      </div>
    </div>
  );
};

const GruppeBlokk = ({ gruppe }: { gruppe: EndringGruppe }) => {
  return (
    <div className={styles.gruppeBlokk}>
      <div className={styles.gruppeHeader}>
        <div className={styles.avatar}>
          {gruppe.utførtAv.slice(0, 2)}
        </div>
        <BodyShort size="small" weight="semibold">
          {gruppe.utførtAv}
        </BodyShort>
      </div>
      <div className={styles.gruppeEndringer}>
        {gruppe.endringer.map((endring) => (
          <EndringRad key={endring.id} endring={endring} />
        ))}
      </div>
    </div>
  );
};

export const Endringshistorikk = () => {
  const { behandling } = useBehandlingContext();
  const { endringshistorikk, laster } = useHentEndringshistorikk(behandling?.id);

  if (laster) {
    return (
      <VStack gap="space-8">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="70%" />
      </VStack>
    );
  }

  if (!endringshistorikk || endringshistorikk.length === 0) {
    return (
      <BodyShort size="small" textColor="subtle">
        Ingen endringer registrert
      </BodyShort>
    );
  }

  const grupper = grupperKonsekutiveEndringer(endringshistorikk);

  return (
    <div className={styles.historikkListe}>
      {grupper.map((gruppe, index) => (
        <GruppeBlokk key={index} gruppe={gruppe} />
      ))}
    </div>
  );
};
