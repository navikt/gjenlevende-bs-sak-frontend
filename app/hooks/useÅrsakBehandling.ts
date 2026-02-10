import { useState, useEffect, useCallback } from "react";
import type { ÅrsakType } from "~/types/årsak";
import { useBehandlingContext } from "~/contexts/BehandlingContext";
import { apiCall, type ApiResponse } from "~/api/backend";

export interface ÅrsakBehandlingRequest {
  kravdato: string;
  årsak: ÅrsakType;
  beskrivelse: string;
}

export interface ÅrsakBehandlingResponse {
  kravdato: string;
  årsak: ÅrsakType;
  beskrivelse: string;
}

interface UseÅrsakBehandling {
  kravdato: Date | undefined;
  årsak: ÅrsakType | "";
  beskrivelse: string;
  laster: boolean;
  feilmelding: string;
  erLagret: boolean;
  oppdaterKravdato: (dato: Date | undefined) => void;
  oppdaterÅrsak: (årsak: ÅrsakType) => void;
  oppdaterBeskrivelse: (beskrivelse: string) => void;
  lagreOgNavigerVidere: () => Promise<boolean>;
}

const tilLocalDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const useArsakBehandling = (behandlingId: string): UseÅrsakBehandling => {
  const { årsakState, oppdaterÅrsakState, hentÅrsakData, årsakDataHentet } = useBehandlingContext();

  const [laster, settLaster] = useState(false);
  const [erLagret, settErLagret] = useState(false);
  const [feilmelding, settFeilmelding] = useState("");

  useEffect(() => {
    if (!behandlingId || årsakDataHentet) return;

    const hentData = async () => {
      settLaster(true);
      settFeilmelding("");

      try {
        await hentÅrsakData();
      } catch {
        settFeilmelding("Kunne ikke hente eksisterende data");
      } finally {
        settLaster(false);
      }
    };

    hentData();
  }, [behandlingId, hentÅrsakData, årsakDataHentet]);

  const oppdaterKravdato = useCallback(
    (dato: Date | undefined) => {
      oppdaterÅrsakState({ kravdato: dato });
    },
    [oppdaterÅrsakState]
  );

  const oppdaterÅrsak = useCallback(
    (årsak: ÅrsakType) => {
      oppdaterÅrsakState({ årsak });
    },
    [oppdaterÅrsakState]
  );

  const oppdaterBeskrivelse = useCallback(
    (beskrivelse: string) => {
      oppdaterÅrsakState({ beskrivelse });
    },
    [oppdaterÅrsakState]
  );

  const lagreOgNavigerVidere = useCallback(async (): Promise<boolean> => {
    const lagreÅrsakBehandling = (
      behandlingId: string,
      request: ÅrsakBehandlingRequest
    ): Promise<ApiResponse<ÅrsakBehandlingResponse>> => {
      return apiCall(`/arsak/${behandlingId}`, {
        method: "POST",
        body: JSON.stringify(request),
      });
    };

    if (!behandlingId || !årsakState?.kravdato || !årsakState?.årsak) {
      return false;
    }

    settLaster(true);
    settFeilmelding("");

    try {
      const response = await lagreÅrsakBehandling(behandlingId, {
        kravdato: tilLocalDateString(årsakState.kravdato),
        årsak: årsakState.årsak,
        beskrivelse: årsakState.beskrivelse,
      });

      if (response.data) {
        settErLagret(true);
        return true;
      }

      settFeilmelding(response.melding || "Kunne ikke lagre årsak for behandling");
      return false;
    } catch {
      settFeilmelding("En uventet feil oppstod ved lagring");
      return false;
    } finally {
      settLaster(false);
    }
  }, [behandlingId, årsakState]);

  return {
    kravdato: årsakState?.kravdato,
    årsak: årsakState?.årsak ?? "",
    beskrivelse: årsakState?.beskrivelse ?? "",
    laster,
    feilmelding,
    erLagret,
    oppdaterKravdato,
    oppdaterÅrsak,
    oppdaterBeskrivelse,
    lagreOgNavigerVidere,
  };
};
