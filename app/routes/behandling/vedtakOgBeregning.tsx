import React, {useState, useEffect} from "react";
import type {Route} from "./+types/vedtakOgBeregning";
import {VStack, Select, HStack} from '@navikt/ds-react';
import {BehandlingResultat} from "~/komponenter/behandling/vedtak/vedtak";
import {InnvilgeVedtak} from "~/komponenter/behandling/vedtak/InnvilgeVedtak";
import {useHentVedtak} from "~/hooks/useHentVedtak";
import {useParams} from "react-router";
import {AvslåVedtak} from "~/komponenter/behandling/vedtak/AvslåVedtak";
import {OppgørVedtak} from "~/komponenter/behandling/vedtak/OpphørVedtak";

export function meta(_: Route.MetaArgs) {
    return [{title: "Vedtak og beregning"}];
}

export default function VedtakOgBeregning() {
    const [vedtaksresultat, settVedtaksResultat] = useState<BehandlingResultat | undefined>(undefined);
    const {behandlingId} = useParams<{ behandlingId: string }>();
    const {vedtak} = useHentVedtak(behandlingId);

    function mapResultatTypeToBehandlingResultat(resultatType?: string): BehandlingResultat | undefined {
        switch (resultatType) {
            case 'INNVILGET':
                return BehandlingResultat.INNVILGE;
            case 'AVSLÅTT':
                return BehandlingResultat.AVSLÅ;
            case 'OPPHØR':
                return BehandlingResultat.OPPHØRT;
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
        <VStack gap="space-40 space-96">
            <HStack>
                <Select label={'Vedtaksresultat'} value={vedtaksresultat || ''} onChange={(e) => {
                    const vedtaksresultatSelect =
                        e.target.value === ''
                            ? undefined
                            : (e.target.value as BehandlingResultat);
                    settVedtaksResultat(vedtaksresultatSelect);
                }}>
                    <option value=''>Velg</option>
                    <option value={BehandlingResultat.INNVILGE}>Innvilge</option>
                    <option value={BehandlingResultat.AVSLÅ}>Avslå</option>
                    <option value={BehandlingResultat.OPPHØRT}>Opphør</option>
                </Select>
            </HStack>
            {vedtaksresultat === BehandlingResultat.INNVILGE && (
                <InnvilgeVedtak lagretVedtak={vedtak}></InnvilgeVedtak>
            )}
            {vedtaksresultat === BehandlingResultat.AVSLÅ && (
                <AvslåVedtak lagretVedtak={vedtak}></AvslåVedtak>
            )}
            {vedtaksresultat === BehandlingResultat.OPPHØRT && (
                <OppgørVedtak lagretVedtak={vedtak}></OppgørVedtak>
            )}
        </VStack>
    );
}
