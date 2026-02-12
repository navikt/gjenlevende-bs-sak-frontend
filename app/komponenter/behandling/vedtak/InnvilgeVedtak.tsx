import React, {useState} from "react";
import {
    ResultatType,
    type Barnetilsynperiode,
    type Vedtak
} from "~/komponenter/behandling/vedtak/vedtak";
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


export const InnvilgeVedtak: React.FC<{ lagretVedtak: Vedtak | null }> = ({lagretVedtak}) => {
    const lagretPerioder = lagretVedtak?.barnetilsynperioder ?? [];
    const {behandlingId} = useParams<{ behandlingId: string }>();
    const {lagreVedtak, opprettFeilmelding} = useLagreVedtak();
    const {beløpsperioder, hentBeløpsperioder, beregnFeilmelding} = useHentBeløpsPerioderForVedtak();

    const [perioder, settPerioder] = useState<Barnetilsynperiode[]>(lagretPerioder);
    const [begrunnelse, settBegrunnelse] = useState<string>(lagretVedtak?.begrunnelse ?? "");

    function handleLagreVedtak() {
        if (!behandlingId) return;
        const Vedtak = {
            resultatType: ResultatType.INNVILGET,
            begrunnelse: begrunnelse,
            barnetilsynperioder: perioder,
        };
        lagreVedtak(behandlingId, Vedtak);
    }

    return (
        <VStack gap="space-20 space-20">
            <BarnetilsynperiodeValg lagretVedtak={lagretVedtak} perioder={perioder}
                                    settPerioder={settPerioder}></BarnetilsynperiodeValg>
            <Textarea label={'Begrunnelse'} value={begrunnelse}
                      onChange={e => settBegrunnelse(e.target.value)}></Textarea>
            <HStack>
                <Button variant="secondary" onClick={() => hentBeløpsperioder(behandlingId, perioder)}>
                    Beregn
                </Button>
            </HStack>
            {beregnFeilmelding && (
                <Alert variant="warning">{beregnFeilmelding}</Alert>
            )}
            {beløpsperioder && (
                <BeregningBarnetilsynTabell beløpsperioder={beløpsperioder}></BeregningBarnetilsynTabell>
            )}
            <HStack>
                <Button onClick={() => handleLagreVedtak()}>
                    Lagre vedtak
                </Button>
            </HStack>
            {opprettFeilmelding && (
                <Alert variant="warning">{opprettFeilmelding}</Alert>
            )}
        </VStack>
    );
};
