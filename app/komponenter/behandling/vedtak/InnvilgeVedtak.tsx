import React, {useState} from "react";
import type {Barnetilsynperiode} from "~/komponenter/behandling/vedtak/vedtak";
import type {Vedtak} from "~/komponenter/behandling/vedtak/vedtak";
import {useNavigate, useParams} from "react-router";
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
import {useBehandlingSteg} from "~/hooks/useBehandlingSteg";
import {useMarkerStegFerdige} from "~/hooks/useMarkerStegFerdige";

export const InnvilgeVedtak: React.FC<{ lagretVedtak: Vedtak | null }> = ({lagretVedtak}) => {
    const {behandlingId} = useParams<{ behandlingId: string }>();
    const {finnNesteSteg} = useBehandlingSteg();
    const [erVilkårUtfylt, settErVilkårUtfylt] = useState<boolean>(false);

    useMarkerStegFerdige("Vilkår", erVilkårUtfylt === true);

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

    const navigate = useNavigate();

    async function handleLagreVedtak() {
        if (!behandlingId) return;
        const Vedtak = {
            resultatType: 'INNVILGET' as const,
            begrunnelse: begrunnelse,
            barnetilsynperioder: perioder,
        };
        const response = await lagreVedtak(behandlingId, Vedtak);
        if (response?.status === 'OK') {
            settErVilkårUtfylt(true);
            const nesteSteg = finnNesteSteg("vedtak-og-beregning");
            if (nesteSteg) {
                navigate(`../${nesteSteg.path}`, {relative: "path"});
            }
        }
    }

    return (
        <VStack gap="space-20 space-20">
            <BarnetilsynperiodeValg perioder={perioder}
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
