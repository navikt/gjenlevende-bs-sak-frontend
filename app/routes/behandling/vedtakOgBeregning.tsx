import React, {useState, useEffect} from "react";
import type {Route} from "./+types/vedtakOgBeregning";
import {HStack, Select} from '@navikt/ds-react';
import {EBehandlingResultat} from "~/komponenter/behandling/vedtak/vedtak";
import {InnvilgeVedtak} from "~/komponenter/behandling/vedtak/InnvilgeVedtak";
import {useHentVedtak} from "~/hooks/useHentVedtak";
import {useParams} from "react-router";
import {AvslåVedtak} from "~/komponenter/behandling/vedtak/AvslåVedtak";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Vedtak og beregning" }];
}

export default function VedtakOgBeregning() {
    const [vedtaksresultat, settVedtaksResultat] = useState<EBehandlingResultat | undefined>(undefined);
    const { behandlingId } = useParams<{ behandlingId: string }>();
    const { vedtak } = useHentVedtak(behandlingId);

    function mapResultatTypeToBehandlingResultat(resultatType?: string): EBehandlingResultat | undefined {
        switch (resultatType) {
            case 'INNVILGET':
                return EBehandlingResultat.INNVILGE;
            case 'AVSLÅTT':
                return EBehandlingResultat.AVSLÅ;
            case 'OPPHØR':
                return EBehandlingResultat.OPPHØRT;
            default:
                return undefined;
        }
    }

    useEffect(() => {
        if (vedtak?.resultatType) {
            settVedtaksResultat(mapResultatTypeToBehandlingResultat(vedtak.resultatType));
        }
    }, [vedtak]);

    return (
        <>
            <div>Vedtak og beregning</div>
            <HStack gap="space-40 space-96">
                <Select label={'Vedtaksresultat'} value={vedtaksresultat || ''} onChange={(e) => {
                    const vedtaksresultatSelect =
                        e.target.value === ''
                            ? undefined
                            : (e.target.value as EBehandlingResultat);
                    settVedtaksResultat(vedtaksresultatSelect);
                }}>
                    <option value=''>Velg </option>
                    <option value={EBehandlingResultat.INNVILGE}>Innvilge </option>
                    <option value={EBehandlingResultat.AVSLÅ}>Avslå </option>
                    <option value={EBehandlingResultat.OPPHØRT}>Opphør</option>
                </Select>
            {vedtaksresultat === EBehandlingResultat.INNVILGE && (
                <InnvilgeVedtak  lagretVedtak={vedtak}></InnvilgeVedtak>
            )}
            </HStack>
            {vedtaksresultat === EBehandlingResultat.AVSLÅ && (
                <AvslåVedtak lagretVedtak={vedtak}></AvslåVedtak>
            )}
            {vedtaksresultat === EBehandlingResultat.OPPHØRT && (
                <HStack>Ingen stønad</HStack>
            )}

        </>
    );
}
