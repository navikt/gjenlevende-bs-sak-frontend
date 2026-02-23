import React, {useState, useEffect, useMemo} from "react";
import type {Barnetilsynperiode} from "~/komponenter/behandling/vedtak/vedtak";
import type {Vedtak} from "~/komponenter/behandling/vedtak/vedtak";
import {useNavigate, useParams} from "react-router";
import {useLagreVedtak} from "~/hooks/useLagreVedtak";
import {
    Alert,
    Button,
    HStack, MonthPicker,
    Textarea, useMonthpicker,
    VStack
} from "@navikt/ds-react";
import {useHentBeløpsPerioderForVedtak} from "~/hooks/useHentBeløpsPerioderForVedtak";
import {BarnetilsynperiodeValg} from "~/komponenter/behandling/vedtak/BarnetilsynperiodeValg";
import {BeregningBarnetilsynTabell} from "~/komponenter/behandling/vedtak/BeregningBarnetilsynTabell";
import {useBehandlingSteg} from "~/hooks/useBehandlingSteg";
import {useMarkerStegFerdige} from "~/hooks/useMarkerStegFerdige";
import {useBehandlingContext} from "~/contexts/BehandlingContext";
import {useHentVedtakHistorikk} from "~/hooks/useHentVedtakHistorikk";
import {format} from "date-fns";

export const InnvilgeVedtak: React.FC<{ lagretVedtak: Vedtak | null , erLesevisning: boolean}> = ({lagretVedtak, erLesevisning}) => {
    const {behandlingId} = useParams<{ behandlingId: string }>();
    const {behandling} = useBehandlingContext()
    const {finnNesteSteg} = useBehandlingSteg();
    const [erVilkårUtfylt, settErVilkårUtfylt] = useState<boolean>(false);

    useMarkerStegFerdige("Vilkår", erVilkårUtfylt);

    const tomBarnetilsynperiode: Barnetilsynperiode = useMemo(() => ({
        behandlingId: behandlingId ?? '',
        datoFra: '',
        datoTil: '',
        utgifter: 0,
        barn: [],
        periodetype: undefined,
        aktivitetstype: undefined,
    }), [behandlingId]);

    const { monthpickerProps, inputProps, selectedMonth } = useMonthpicker();

    const lagretPerioder = lagretVedtak?.barnetilsynperioder && lagretVedtak.barnetilsynperioder.length > 0
        ? lagretVedtak.barnetilsynperioder
        : [tomBarnetilsynperiode];

    const {lagreVedtak, opprettFeilmelding} = useLagreVedtak();
    const {beløpsperioder, hentBeløpsperioder, beregnFeilmelding} = useHentBeløpsPerioderForVedtak();

    const formatertValgtMåned = selectedMonth ? format(selectedMonth, 'yyyy-MM') : null;
    const {vedtak: historiskVedtak} = useHentVedtakHistorikk(
        behandling?.forrigeBehandlingId ? behandlingId : undefined,
        formatertValgtMåned
    );

    const [perioder, settPerioder] = useState<Barnetilsynperiode[]>(lagretPerioder);
    const [begrunnelse, settBegrunnelse] = useState<string>(lagretVedtak?.begrunnelse ?? "");

    useEffect(() => {
        const hentVedtakHistorikkFraMåned = (selectedMonth: Date, historiskVedak: Vedtak): Barnetilsynperiode[] => {
            if (!historiskVedak?.barnetilsynperioder) return [tomBarnetilsynperiode];

            const filteredPerioder = historiskVedak.barnetilsynperioder.filter(periode => {
                const periodeTil = new Date(periode.datoTil);
                return periodeTil >= selectedMonth;
            }).map(periode => {
                const periodeFra = new Date(periode.datoFra);
                if (periodeFra < selectedMonth) {
                    return {
                        ...periode,
                        datoFra: selectedMonth.toISOString().split('T')[0]
                    };
                }
                return periode;
            });

            return filteredPerioder.length > 0 ? filteredPerioder : [tomBarnetilsynperiode];
        };

        if (behandling?.forrigeBehandlingId && selectedMonth && historiskVedtak) {
            settPerioder(hentVedtakHistorikkFraMåned(selectedMonth, historiskVedtak));
        }
    }, [selectedMonth, historiskVedtak, behandling?.forrigeBehandlingId, tomBarnetilsynperiode]);

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
            {behandling?.forrigeBehandlingId && (<MonthPicker {...monthpickerProps}>
                    <MonthPicker.Input
                        {...inputProps}
                        label="Revurderes fra og med"
                    />
                </MonthPicker>
            )}
            {(!behandling?.forrigeBehandlingId || selectedMonth) && (
                <>
                    <BarnetilsynperiodeValg perioder={perioder}
                                            settPerioder={settPerioder}
                                            erLesevisning={erLesevisning}></BarnetilsynperiodeValg>
                    <Textarea label={'Begrunnelse'} value={begrunnelse}
                              onChange={e => settBegrunnelse(e.target.value)} disabled={erLesevisning}></Textarea>
                    <HStack>
                        <Button variant="secondary" onClick={() => hentBeløpsperioder(behandlingId, perioder)}
                                disabled={erLesevisning}>
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
                        <Button onClick={() => handleLagreVedtak()} disabled={erLesevisning}>
                            Lagre vedtak
                        </Button>
                    </HStack>
                    {opprettFeilmelding && (
                        <Alert variant="warning">{opprettFeilmelding}</Alert>
                    )}
                </>)}
        </VStack>
    );
};
