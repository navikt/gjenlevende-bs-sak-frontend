import React, {useState} from "react";
import type {Barnetilsynperiode} from "~/komponenter/behandling/vedtak/vedtak";
import type {Vedtak} from "~/komponenter/behandling/vedtak/vedtak";
import {useParams} from "react-router";
import {useLagreVedtak} from "~/hooks/useLagreVedtak";
import {
    Alert,
    Button,
    HStack,
    Textarea,
    VStack
} from "@navikt/ds-react";
import {useHentBeløpsPerioderForVedtak} from "~/hooks/useHentBeløpsPerioderForVedtak";
import {BarnetilsynperiodeValg} from "~/komponenter/behandling/vedtak/BarnetilsynperiodeValg";
import {BeregningBarnetilsynTabell} from "~/komponenter/behandling/vedtak/BeregningBarnetilsynTabell";

interface InnvilgeVedtakProps {
    lagretVedtak: Vedtak | null;
    erLesevisning: boolean;
    låst: boolean;
    onLagreSuksess: () => void;
}

export const InnvilgeVedtak: React.FC<InnvilgeVedtakProps> = ({lagretVedtak, erLesevisning, låst, onLagreSuksess}) => {
    const {behandlingId} = useParams<{ behandlingId: string }>();

    const tomBarnetilsynperiode: Barnetilsynperiode = {
        behandlingId: behandlingId ?? '',
        datoFra: '',
        datoTil: '',
        utgifter: 0,
        barn: [],
        periodetype: undefined,
        aktivitetstype: undefined,
    };

    const lagretPerioder = lagretVedtak?.barnetilsynperioder && lagretVedtak.barnetilsynperioder.length > 0
        ? lagretVedtak.barnetilsynperioder
        : [tomBarnetilsynperiode];

    const {lagreVedtak, opprettFeilmelding} = useLagreVedtak();
    const {beløpsperioder, hentBeløpsperioder, beregnFeilmelding} = useHentBeløpsPerioderForVedtak();

    const [perioder, settPerioder] = useState<Barnetilsynperiode[]>(lagretPerioder);
    const [begrunnelse, settBegrunnelse] = useState<string>(lagretVedtak?.begrunnelse ?? "");

    const erLåst = erLesevisning || låst;

    async function handleLagreVedtak() {
        if (!behandlingId) return;
        const Vedtak = {
            resultatType: 'INNVILGET' as const,
            begrunnelse: begrunnelse,
            barnetilsynperioder: perioder,
        };
        const response = await lagreVedtak(behandlingId, Vedtak);
        if (response?.status === 'OK') {
            onLagreSuksess();
        }
    }

    return (
        <VStack gap="space-24">
            <VStack gap="space-16">
                <BarnetilsynperiodeValg perioder={perioder}
                                        settPerioder={settPerioder} erLesevisning={erLåst}></BarnetilsynperiodeValg>
            </VStack>
            <Textarea label={'Begrunnelse'} value={begrunnelse}
                      onChange={e => settBegrunnelse(e.target.value)} disabled={erLåst}></Textarea>
            <HStack>
                <Button variant="secondary" onClick={() => hentBeløpsperioder(behandlingId, perioder)} disabled={erLåst}>
                    Beregn
                </Button>
            </HStack>
            {beregnFeilmelding && (
                <Alert variant="warning">{beregnFeilmelding}</Alert>
            )}
            {beløpsperioder && (
                <BeregningBarnetilsynTabell beløpsperioder={beløpsperioder}></BeregningBarnetilsynTabell>
            )}
            {!låst && (
                <HStack>
                    <Button onClick={() => handleLagreVedtak()} disabled={erLesevisning}>
                        Lagre vedtak
                    </Button>
                </HStack>
            )}
            {opprettFeilmelding && (
                <Alert variant="warning">{opprettFeilmelding}</Alert>
            )}
        </VStack>
    );
};
