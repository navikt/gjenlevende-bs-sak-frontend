import React, {useState, useEffect} from "react";
import type {Route} from "./+types/vedtakOgBeregning";
import {Box, VStack, Select, HStack} from '@navikt/ds-react';
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
        <Box shadow="dialog" background="neutral-soft" padding="space-24" borderRadius="4">
            <VStack gap="space-12">
                <Select
                    label={'Vedtaksresultat'}
                    value={vedtaksresultat || ''}
                    onChange={(e) => handleVedtaksresultatEndring(e.target.value)}
                    disabled={erLesevisning}
                    style={{maxWidth: "24rem"}}
                >
                    <option value=''>Velg</option>
                    <option value='INNVILGET'>Innvilge</option>
                    <option value='AVSLÅTT'>Avslå</option>
                    <option value='OPPHØR'>Opphør</option>
                </Select>
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
        </Box>
    );
}
