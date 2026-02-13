import React, {useState, useEffect} from "react";
import type {Route} from "./+types/vedtakOgBeregning";
import {VStack, Select, HStack} from '@navikt/ds-react';
import type {ResultatType} from "~/komponenter/behandling/vedtak/vedtak";
import {InnvilgeVedtak} from "~/komponenter/behandling/vedtak/InnvilgeVedtak";
import {useHentVedtak} from "~/hooks/useHentVedtak";
import {useParams} from "react-router";
import {AvslåVedtak} from "~/komponenter/behandling/vedtak/AvslåVedtak";
import {OppgørVedtak} from "~/komponenter/behandling/vedtak/OpphørVedtak";
import {useErLesevisning} from "~/hooks/useErLesevisning";

export function meta(_: Route.MetaArgs) {
    return [{title: "Vedtak og beregning"}];
}

export default function VedtakOgBeregning() {
    const [vedtaksresultat, settVedtaksResultat] = useState<ResultatType | undefined>(undefined);
    const {behandlingId} = useParams<{ behandlingId: string }>();
    const {vedtak} = useHentVedtak(behandlingId);
    const erLesevisning = useErLesevisning();

    useEffect(() => {
        if (vedtak?.resultatType) {
            settVedtaksResultat(vedtak.resultatType);
        }
    }, [vedtak]);

    const handleVedtaksresultatEndring = (value: string) => {
        const resultat = value === '' ? undefined : (value as ResultatType);
        settVedtaksResultat(resultat);
    };

    return (
        <VStack gap="space-40 space-96">
            <HStack>
                <Select
                    label={'Vedtaksresultat'}
                    value={vedtaksresultat || ''}
                    onChange={(e) => handleVedtaksresultatEndring(e.target.value)}
                    disabled={erLesevisning}
                >
                    <option value=''>Velg</option>
                    <option value='INNVILGET'>Innvilge</option>
                    <option value='AVSLÅTT'>Avslå</option>
                    <option value='OPPHØR'>Opphør</option>
                </Select>
            </HStack>
            {vedtaksresultat === 'INNVILGET' && (
                <InnvilgeVedtak lagretVedtak={vedtak} erLesevisning={erLesevisning}></InnvilgeVedtak>
            )}
            {vedtaksresultat === 'AVSLÅTT' && (
                <AvslåVedtak lagretVedtak={vedtak} erLesevisning={erLesevisning}></AvslåVedtak>
            )}
            {vedtaksresultat === 'OPPHØR' && (
                <OppgørVedtak lagretVedtak={vedtak} erLesevisning={erLesevisning}></OppgørVedtak>
            )}
        </VStack>
    );
}
