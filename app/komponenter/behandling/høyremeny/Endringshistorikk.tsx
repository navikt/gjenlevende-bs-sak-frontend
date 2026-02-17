import React from "react";
import { BodyShort, Detail, Skeleton, VStack } from "@navikt/ds-react";
import {
  PlusCircleIcon,
  PaperplaneIcon,
  ArrowUndoIcon,
  TasklistIcon,
  CheckmarkCircleIcon,
  DocPencilIcon,
  NotePencilIcon,
  PersonIcon,
} from "@navikt/aksel-icons";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { useHentEndringshistorikk } from "~/hooks/useHentEndringshistorikk";
import { formaterIsoDatoTid } from "~/utils/utils";
import type { EndringType, BehandlingEndring } from "~/types/endringshistorikk";
import styles from "./Endringshistorikk.module.css";

const endringTypeTilTekst = (type: EndringType): string => {
  const tekster: Record<EndringType, string> = {
    BEHANDLING_OPPRETTET: "Behandling opprettet",
    SENDT_TIL_BESLUTTER: "Sendt til beslutter",
    ANGRET_SEND_TIL_BESLUTTER: "Angret send til beslutter",
    VILKÅR_VURDERING_OPPRETTET: "Vilkår opprettet",
    VILKÅR_VURDERING_OPPDATERT: "Vilkår oppdatert",
    VEDTAK_LAGRET: "Vedtak lagret",
    BREV_MELLOMLAGRET: "Brev mellomlagret",
    BREV_PDF_GENERERT: "Brev PDF generert",
    ÅRSAK_LAGRET: "Årsak lagret",
    ÅRSAK_OPPDATERT: "Årsak oppdatert",
    BESLUTTER_GODKJENT: "Beslutter godkjent",
  };
  return tekster[type];
};

const endringTypeIkon = (type: EndringType) => {
  const ikoner: Record<EndringType, React.ElementType> = {
    BEHANDLING_OPPRETTET: PlusCircleIcon,
    SENDT_TIL_BESLUTTER: PaperplaneIcon,
    ANGRET_SEND_TIL_BESLUTTER: ArrowUndoIcon,
    VILKÅR_VURDERING_OPPRETTET: TasklistIcon,
    VILKÅR_VURDERING_OPPDATERT: TasklistIcon,
    VEDTAK_LAGRET: CheckmarkCircleIcon,
    BREV_MELLOMLAGRET: DocPencilIcon,
    BREV_PDF_GENERERT: DocPencilIcon,
    ÅRSAK_LAGRET: NotePencilIcon,
    ÅRSAK_OPPDATERT: NotePencilIcon,
    BESLUTTER_GODKJENT: CheckmarkCircleIcon,
  };
  return ikoner[type];
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
  const Ikon = endringTypeIkon(endring.endringType);

  return (
    <div className={styles.endringRad}>
      <Ikon className={styles.endringIkon} aria-hidden />
      <div className={styles.endringInnhold}>
        <BodyShort size="small" weight="semibold">
          {endringTypeTilTekst(endring.endringType)}
        </BodyShort>
        {endring.detaljer && (
          <Detail textColor="subtle">{endring.detaljer}</Detail>
        )}
        <Detail textColor="subtle">{formaterIsoDatoTid(endring.utførtTid)}</Detail>
      </div>
    </div>
  );
};

const GruppeBlokk = ({ gruppe }: { gruppe: EndringGruppe }) => {
  return (
    <div className={styles.gruppeBlokk}>
      <div className={styles.gruppeHeader}>
        <PersonIcon className={styles.personIkon} aria-hidden />
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
