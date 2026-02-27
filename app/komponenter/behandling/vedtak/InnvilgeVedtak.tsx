import React, {useState, useEffect} from "react";
import type {Barnetilsynperiode} from "~/komponenter/behandling/vedtak/vedtak";
import type {Vedtak} from "~/komponenter/behandling/vedtak/vedtak";
import {useParams} from "react-router";
import {useLagreVedtak} from "~/hooks/useLagreVedtak";
import {
    Alert,
    Button,
    HStack, MonthPicker,
    Textarea,
    useMonthpicker,
    VStack
} from "@navikt/ds-react";
import {useHentBeløpsPerioderForVedtak} from "~/hooks/useHentBeløpsPerioderForVedtak";
import {BarnetilsynperiodeValg} from "~/komponenter/behandling/vedtak/BarnetilsynperiodeValg";
import {BeregningBarnetilsynTabell} from "~/komponenter/behandling/vedtak/BeregningBarnetilsynTabell";
import {useHentVedtakHistorikk} from "~/hooks/useHentVedtakHistorikk";
import {useBehandlingContext} from "~/contexts/BehandlingContext";
import {format} from "date-fns";

interface InnvilgeVedtakProps {
    lagretVedtak: Vedtak | null;
    erLesevisning: boolean;
    låst: boolean;
    onLagreSuksess: () => void;
}

const tomBarnetilsynperiode: Barnetilsynperiode = {
    datoFra: '',
    datoTil: '',
    utgifter: 0,
    barn: [],
    periodetype: undefined,
    aktivitetstype: undefined,
};

export const InnvilgeVedtak: React.FC<InnvilgeVedtakProps> = ({lagretVedtak, erLesevisning, låst, onLagreSuksess}) => {
    const {behandlingId} = useParams<{ behandlingId: string }>();
    const {behandling} = useBehandlingContext()

    const lagretPerioder = lagretVedtak?.barnetilsynperioder && lagretVedtak.barnetilsynperioder.length > 0
        ? lagretVedtak.barnetilsynperioder
        : [tomBarnetilsynperiode];

    const {lagreVedtak, opprettFeilmelding} = useLagreVedtak();
    const {beløpsperioder, hentBeløpsperioder, beregnFeilmelding} = useHentBeløpsPerioderForVedtak();

    const førsteBarnetilsynsperiodeLageretVedtak: string | undefined = lagretVedtak?.barnetilsynperioder.at(0)?.datoFra
    const { monthpickerProps, inputProps, selectedMonth } = useMonthpicker({
        defaultSelected: førsteBarnetilsynsperiodeLageretVedtak ? new Date(førsteBarnetilsynsperiodeLageretVedtak) : undefined,
        onMonthChange: () => settHarEndretMåned(true)
    });

    const [harEndretMåned, settHarEndretMåned] = useState(false);

    const formatertValgtMåned = selectedMonth ? format(selectedMonth, 'yyyy-MM') : null;
    const erRevurdering = !!behandling?.forrigeBehandlingId;
    const {vedtak: historiskVedtak} = useHentVedtakHistorikk(
        erRevurdering ? behandlingId : undefined,
        formatertValgtMåned
    );

    const [perioder, settPerioder] = useState<Barnetilsynperiode[]>(lagretPerioder);
    const [begrunnelse, settBegrunnelse] = useState<string>(lagretVedtak?.begrunnelse ?? "");

    useEffect(() => {
        settHarEndretMåned(false);
    }, [lagretVedtak]);

    useEffect(() => {
        const hentVedtakHistorikkFraMåned = (selectedMonth: Date, historiskVedak: Vedtak): Barnetilsynperiode[] => {
            const selectedYearMonth = format(selectedMonth, 'yyyy-MM');
            
            if (!historiskVedak?.barnetilsynperioder) {
                return [{
                    ...tomBarnetilsynperiode,
                    datoFra: selectedYearMonth,
                }];
            }

            const filtrerteHistoriskePerioder = historiskVedak.barnetilsynperioder.filter(periode => {
                const periodeTil = new Date(periode.datoTil);
                return periodeTil >= selectedMonth;
            }).map(periode => {
                const periodeFra = new Date(periode.datoFra);
                if (periodeFra < selectedMonth) {
                    return {
                        ...periode,
                        datoFra: selectedYearMonth
                    };
                }
                return periode;
            });

            if (filtrerteHistoriskePerioder.length === 0) {
                return [{
                    ...tomBarnetilsynperiode,
                    datoFra: selectedYearMonth,
                }];
            }

            const førstePeriode = filtrerteHistoriskePerioder[0];
            const førstePeriodeYearMonth = førstePeriode.datoFra.substring(0, 7);
            
            if (førstePeriodeYearMonth > selectedYearMonth) {
                const førstePeriodeFra = new Date(førstePeriode.datoFra);
                const tomPeriodeTil = new Date(førstePeriodeFra.getFullYear(), førstePeriodeFra.getMonth() - 1, 1);
                
                const tomPeriodeMedDatoer: Barnetilsynperiode = {
                    datoFra: format(selectedMonth, 'yyyy-MM'),
                    datoTil: format(tomPeriodeTil, 'yyyy-MM'),
                    utgifter: 0,
                    barn: [],
                    periodetype: undefined,
                    aktivitetstype: undefined,
                };
                return [tomPeriodeMedDatoer, ...filtrerteHistoriskePerioder];
            }

            return filtrerteHistoriskePerioder;
        };

        const skalBrukeLagretVedtak = lagretVedtak && !harEndretMåned;
        if (erRevurdering && selectedMonth && historiskVedtak && !skalBrukeLagretVedtak) {
            const nyePerioder = hentVedtakHistorikkFraMåned(selectedMonth, historiskVedtak);
            settPerioder(nyePerioder);
        }
    }, [selectedMonth, historiskVedtak, erRevurdering, lagretVedtak, harEndretMåned]);

    const erLåst = erLesevisning || låst;

    const [valideringsFeil, settValideringsFeil] = useState<string | null>(null);

    const validerPerioder = (): boolean => {
        for (let i = 0; i < perioder.length; i++) {
            const periode = perioder[i];
            const mangler: string[] = [];
            
            if (!periode.periodetype) mangler.push('periodetype');
            if (!periode.aktivitetstype) mangler.push('aktivitet');
            if (!periode.datoFra) mangler.push('periode fra');
            if (!periode.datoTil) mangler.push('periode til');
            
            if (mangler.length > 0) {
                settValideringsFeil(`Periode ${i + 1} mangler: ${mangler.join(', ')}`);
                return false;
            }
        }
        settValideringsFeil(null);
        return true;
    };

    async function handleBergen(behandlingId : string | undefined, perioder : Barnetilsynperiode[]) {
        if (!validerPerioder()) return;

        hentBeløpsperioder(behandlingId, perioder)
    }

    async function handleLagreVedtak() {
        if (!behandlingId) return;
        if (!validerPerioder()) return;
        
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
                {erRevurdering && (<MonthPicker {...monthpickerProps}>
                    <MonthPicker.Input
                        {...inputProps}
                        disabled={erLåst}
                        label="Revurderes fra og med"
                    />
                </MonthPicker>
            )}
            {(!erRevurdering || selectedMonth || lagretVedtak) && (
                <>
                    <BarnetilsynperiodeValg perioder={perioder}
                                            settPerioder={settPerioder}
                                            erLesevisning={erLåst}
                                            erRevurdering={erRevurdering}></BarnetilsynperiodeValg>
                    <Textarea label={'Begrunnelse'} value={begrunnelse}
                              onChange={e => settBegrunnelse(e.target.value)} disabled={erLåst}></Textarea>
                    <HStack>
                        <Button variant="secondary" onClick={() => handleBergen(behandlingId, perioder)}
                                disabled={erLåst}>
                            Beregn
                        </Button>
                    </HStack>
                    {beregnFeilmelding && (
                        <Alert variant="warning">{beregnFeilmelding}</Alert>
                    )}
                    {beløpsperioder && (
                        <BeregningBarnetilsynTabell beløpsperioder={beløpsperioder}></BeregningBarnetilsynTabell>
                    )}
                    {!låst && (<HStack>
                        <Button onClick={() => handleLagreVedtak()} disabled={erLesevisning}>
                            Lagre vedtak
                        </Button>
                    </HStack>)}
                    {valideringsFeil && (
                        <Alert variant="error">{valideringsFeil}</Alert>
                    )}
                    {opprettFeilmelding && (
                        <Alert variant="warning">{opprettFeilmelding}</Alert>
                    )}
                </>)}
        </VStack>
    );
};
