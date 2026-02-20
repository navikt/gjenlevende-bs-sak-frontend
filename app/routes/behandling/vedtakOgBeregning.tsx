import React, { useState, useRef } from "react";
import type { Route } from "./+types/vedtakOgBeregning";
import { Box, Button, HStack, Loader, VStack, Select } from "@navikt/ds-react";
import { PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import type { ResultatType } from "~/komponenter/behandling/vedtak/vedtak";
import { InnvilgeVedtak } from "~/komponenter/behandling/vedtak/InnvilgeVedtak";
import { useHentVedtak } from "~/hooks/useHentVedtak";
import { useNavigate, useParams } from "react-router";
import { AvslåVedtak } from "~/komponenter/behandling/vedtak/AvslåVedtak";
import { OppgørVedtak } from "~/komponenter/behandling/vedtak/OpphørVedtak";
import { useErLesevisning } from "~/hooks/useErLesevisning";
import { useBehandlingSteg } from "~/hooks/useBehandlingSteg";
import { useMarkerStegFerdige } from "~/hooks/useMarkerStegFerdige";
import type { StegPath } from "~/komponenter/navbar/BehandlingFaner";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Vedtak og beregning" }];
}

const STEG_PATH: StegPath = "vedtak-og-beregning";

export default function VedtakOgBeregning() {
  const [vedtaksresultat, settVedtaksResultat] = useState<ResultatType | undefined>(undefined);
  const [låst, settLåst] = useState(false);
  const [erLagret, settErLagret] = useState(false);
  const { behandlingId } = useParams<{ behandlingId: string }>();
  const { vedtak, laster: lasterVedtak } = useHentVedtak(behandlingId);
  const erLesevisning = useErLesevisning();
  const navigate = useNavigate();
  const { finnNesteSteg } = useBehandlingSteg();

  useMarkerStegFerdige("Vedtak og beregning", erLagret);

  const harSjekketInitiellLås = useRef(false);

  if (vedtak?.resultatType && !harSjekketInitiellLås.current) {
    harSjekketInitiellLås.current = true;
    settVedtaksResultat(vedtak.resultatType);
    settLåst(true);
    settErLagret(true);
  }

  const handleVedtaksresultatEndring = (value: string) => {
    const resultat = value === "" ? undefined : (value as ResultatType);
    settVedtaksResultat(resultat);
  };

  const handleLagreSuksess = () => {
    settLåst(true);
    settErLagret(true);
  };

  const handleSlett = () => {
    settVedtaksResultat(undefined);
    settLåst(false);
    settErLagret(false);
  };

  const navigerTilNeste = () => {
    const nesteSteg = finnNesteSteg(STEG_PATH);
    if (nesteSteg) {
      navigate(`../${nesteSteg.path}`, { relative: "path" });
    }
  };

  if (lasterVedtak) {
    return (
      <Box shadow="dialog" background="neutral-soft" padding="space-24" borderRadius="4">
        <Loader size="medium" />
      </Box>
    );
  }

  return (
    <VStack gap="space-24">
      <Box shadow="dialog" background="neutral-soft" padding="space-24" borderRadius="4">
        <VStack gap="space-12" style={{ position: "relative" }}>
          {låst && !erLesevisning && (
            <HStack gap="space-2" style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}>
              <Button
                variant="tertiary"
                size="small"
                icon={<PencilIcon title="Rediger" />}
                onClick={() => settLåst(false)}
              >
                Rediger
              </Button>
              <Button
                variant="tertiary"
                size="small"
                icon={<TrashIcon title="Slett" fontSize="1.5rem" />}
                onClick={handleSlett}
              >
                Slett
              </Button>
            </HStack>
          )}
          <Select
            label={"Vedtaksresultat"}
            value={vedtaksresultat || ""}
            onChange={(e) => handleVedtaksresultatEndring(e.target.value)}
            disabled={erLesevisning || låst}
            style={{ maxWidth: "24rem" }}
          >
            <option value="">Velg</option>
            <option value="INNVILGET">Innvilge</option>
            <option value="AVSLÅTT">Avslå</option>
            <option value="OPPHØR">Opphør</option>
          </Select>
          {vedtaksresultat === "INNVILGET" && (
            <InnvilgeVedtak
              lagretVedtak={vedtak}
              erLesevisning={erLesevisning}
              låst={låst}
              onLagreSuksess={handleLagreSuksess}
            />
          )}
          {vedtaksresultat === "AVSLÅTT" && (
            <AvslåVedtak
              lagretVedtak={vedtak}
              erLesevisning={erLesevisning}
              låst={låst}
              onLagreSuksess={handleLagreSuksess}
            />
          )}
          {vedtaksresultat === "OPPHØR" && (
            <OppgørVedtak
              lagretVedtak={vedtak}
              erLesevisning={erLesevisning}
              låst={låst}
              onLagreSuksess={handleLagreSuksess}
            />
          )}
        </VStack>
      </Box>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={navigerTilNeste} disabled={!erLagret}>
          Neste
        </Button>
      </div>
    </VStack>
  );
}
