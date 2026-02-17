import type React from "react";
import {
  PlusCircleIcon,
  PaperplaneIcon,
  ArrowUndoIcon,
  TasklistIcon,
  CheckmarkCircleIcon,
  NotePencilIcon,
} from "@navikt/aksel-icons";
import { formaterIsoDatoTid } from "~/utils/utils";
import type { EndringType, BehandlingEndring } from "~/types/endringshistorikk";
import type { TagFarge } from "~/types/farge";

export interface EndringMeta {
  tekst: string;
  ikon: React.ElementType;
  farge: TagFarge;
  erMilstein: boolean;
}

export const endringMeta: Record<EndringType, EndringMeta> = {
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

export const formaterRelativTid = (isoTid: string): string => {
  const tid = new Date(isoTid);
  const nå = new Date();
  const diffSekunder = Math.floor((nå.getTime() - tid.getTime()) / 1000);

  if (diffSekunder < 60) return "Akkurat nå";
  if (diffSekunder < 3600) return `${Math.floor(diffSekunder / 60)} min. siden`;
  if (diffSekunder < 86400) return `${Math.floor(diffSekunder / 3600)} t. siden`;
  if (diffSekunder < 604800) return `${Math.floor(diffSekunder / 86400)} d. siden`;
  return formaterIsoDatoTid(isoTid);
};

export interface EndringGruppe {
  utførtAv: string;
  endringer: BehandlingEndring[];
}

export const grupperKonsekutiveEndringer = (endringer: BehandlingEndring[]): EndringGruppe[] => {
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
