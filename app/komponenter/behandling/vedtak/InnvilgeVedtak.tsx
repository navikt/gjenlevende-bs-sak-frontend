import React, {useState} from "react";
import {
    EAktivitetstypeBarnetilsyn,
    EPeriodetype,
    EResultatType,
    type IVedtak,
    type IBarnetilsynperiode
} from "~/komponenter/behandling/vedtak/vedtak";
import {useParams} from "react-router";
import {useLagreVedtak} from "~/hooks/useLagreVedtak";
import {
    Select,
    UNSAFE_Combobox,
    TextField,
    Button, Textarea, HStack, VStack, MonthPicker, Table
} from "@navikt/ds-react";
import { TrashIcon } from '@navikt/aksel-icons';
import {useHentBeløpsPerioderForVedtak} from "~/hooks/useHentBeløpsPerioderForVedtak";
import {månedStringTilYearMonth, formaterYearMonthStringTilNorskDato} from "~/utils/utils";

export const InnvilgeVedtak: React.FC<{lagretVedtak: IVedtak | null}> = ({lagretVedtak}) => {
    const lagretPerioder = lagretVedtak?.barnetilsynperioder || [];
    const { behandlingId } = useParams<{ behandlingId: string }>();
    const { lagreVedtak } = useLagreVedtak();
    const { beløpsperioder, hent } = useHentBeløpsPerioderForVedtak();
    const barnOptions = [
        { label: 'Barn 1', value: 'b1e1d2c3-1111-2222-3333-444455556666' },
        { label: 'Barn 2', value: 'b2e2d3c4-7777-8888-9999-000011112222' },
        { label: 'Barn 3', value: 'b3e3d4c5-aaaa-bbbb-cccc-ddddeeeeffff' },
    ];

    const [perioder, setPerioder] = useState<IBarnetilsynperiode[]>(lagretPerioder);
    const [begrunnelse, setBegrunnelse] = useState<string>(lagretVedtak?.begrunnelse ? String(lagretVedtak.begrunnelse) : "");

    function handlePeriodeChange(index: number, field: keyof IBarnetilsynperiode, value: string | number | string[]) {
        setPerioder(prev => prev.map((p, i) =>
            i === index ? { ...p, [field]: value } : p
        ));
    }

    function handleBarnChange(index: number, option: string, isSelected: boolean) {
        setPerioder(prev => prev.map((p, i) =>
            i === index
                ? { ...p, barn: isSelected ? [...p.barn, option] : p.barn.filter(b => b !== option) }
                : p
        ));
    }

    function handlePeriodeMonthChange(index: number, field: 'datoFra' | 'datoTil', value: string) {
        setPerioder(prev => prev.map((p, i) =>
            i === index ? { ...p, [field]: value } : p
        ));
    }

    function leggTilPeriode() {
        if (!behandlingId) return;
        setPerioder(prev => [
            ...prev,
            {
                behandlingId,
                datoFra: '',
                datoTil: '',
                utgifter: 0,
                barn: [],
                periodetype: undefined,
                aktivitetstype: undefined,
            }
        ]);
    }

    function slettPeriode(index: number) {
        setPerioder(prev => prev.filter((_, i) => i !== index));
    }

    return (
        <VStack gap="16">
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Periodetype</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Periode fra og med</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Periode til og med</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Velg barn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Antall barn</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Utgifter</Table.HeaderCell>
                        <Table.HeaderCell scope="col"> </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {perioder.map((periode, index) => (
                    <Table.Row key={index}>
                        <Table.DataCell>
                            <Select label="Periodetype" value={periode.periodetype} onChange={e => handlePeriodeChange(index, 'periodetype', e.target.value as EPeriodetype)} hideLabel>
                                <option value="">Velg</option>
                                <option value={EPeriodetype.ORDINÆR}>Ordinær</option>
                                <option value={EPeriodetype.INGEN_STØNAD}>Ingen stønad</option>
                            </Select>
                        </Table.DataCell>
                        <Table.DataCell>
                            <Select label="Aktivitet" value={periode.aktivitetstype} onChange={e => handlePeriodeChange(index, 'aktivitetstype', e.target.value as EAktivitetstypeBarnetilsyn)} hideLabel>
                                <option value="">Velg</option>
                                <option value={EAktivitetstypeBarnetilsyn.I_ARBEID}>I arbeid</option>
                                <option value={EAktivitetstypeBarnetilsyn.FORBIGÅENDE_SYKDOM}>Forbigående sykdom</option>
                            </Select>
                        </Table.DataCell>
                        <Table.DataCell>
                            <MonthPicker
                                selected={periode.datoFra ? new Date(periode.datoFra) : undefined}
                                onMonthSelect={date => handlePeriodeMonthChange(index, 'datoFra', date ? månedStringTilYearMonth(date.toLocaleString('nb-NO', { month: 'long', year: 'numeric' })) : '')}
                            >
                                <MonthPicker.Input
                                    label="Fra og med"
                                    hideLabel
                                    value={formaterYearMonthStringTilNorskDato(periode.datoFra)}
                                    onChange={e => handlePeriodeMonthChange(index, 'datoFra', e.target.value)}
                                    description="Format: mm.åååå"
                                />
                            </MonthPicker>
                        </Table.DataCell>
                        <Table.DataCell>
                            <MonthPicker
                                selected={periode.datoTil ? new Date(periode.datoTil) : undefined}
                                onMonthSelect={date => handlePeriodeMonthChange(index, 'datoTil', date ? månedStringTilYearMonth(date.toLocaleString('nb-NO', { month: 'long', year: 'numeric' })) : '')}
                                fromDate={periode.datoFra ? new Date(periode.datoFra) : undefined}
                            >
                                <MonthPicker.Input
                                    label="Til og med"
                                    hideLabel
                                    value={formaterYearMonthStringTilNorskDato(periode.datoTil)}
                                    onChange={e => handlePeriodeMonthChange(index, 'datoTil', e.target.value)}
                                    description="Format: mm.åååå"
                                />
                            </MonthPicker>
                        </Table.DataCell>
                        <Table.DataCell>
                            <UNSAFE_Combobox
                                label={'Barn'}
                                options={barnOptions.map((o) => ({
                                    label: o.label,
                                    value: o.value,
                                }))}
                                isMultiSelect
                                hideLabel
                                placeholder={'Velg barn'}
                                selectedOptions={periode.barn}
                                onToggleSelected={(option, isSelected) => handleBarnChange(index, option, isSelected)}
                            />
                        </Table.DataCell>
                        <Table.DataCell>
                            <span>{periode.barn.length}</span>
                        </Table.DataCell>
                        <Table.DataCell>
                            <TextField label="Utgifter" value={periode.utgifter} onChange={e => handlePeriodeChange(index, 'utgifter', Number(e.target.value))} hideLabel />
                        </Table.DataCell>
                        <Table.DataCell>
                            <TrashIcon onClick={() => slettPeriode(index)} fontSize="1.5rem"></TrashIcon>
                        </Table.DataCell>
                    </Table.Row>
                ))}
                </Table.Body>
            </Table>
            <HStack>
                <Button onClick={leggTilPeriode}>
                    Legg til vedtaksperiode
                </Button>
            </HStack>
            <Textarea label={'Begrunnelse'} value={begrunnelse} onChange={e => setBegrunnelse(e.target.value)}></Textarea>
            <HStack>
                <Button onClick={() => hent(behandlingId, perioder)}>
                    Beregn
                </Button>
            </HStack>
            {beløpsperioder && (
                <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Periode</Table.HeaderCell>
                        <Table.HeaderCell>Antall barn</Table.HeaderCell>
                        <Table.HeaderCell>Utgifter</Table.HeaderCell>
                        <Table.HeaderCell>Stønadsbeløp pr mnd</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                    <Table.Body>
                {beløpsperioder.map((periode, idx) => (
                    <Table.Row key={idx}>
                        <Table.DataCell>{periode.datoFra} - {periode.datoTil}</Table.DataCell>
                        <Table.DataCell>{periode.antallBarn}</Table.DataCell>
                        <Table.DataCell>{periode.utgifter}</Table.DataCell>
                        <Table.DataCell>{periode.beløp}</Table.DataCell>
                    </Table.Row>
                ))}
                    </Table.Body>
            </Table>
            )}
            <HStack>
                <Button
                    onClick={() => {
                        if (!behandlingId) return;
                        const Vedtak = {
                            resultatType: EResultatType.INNVILGET,
                            begrunnelse: begrunnelse,
                            barnetilsynperioder: perioder,
                        };
                        lagreVedtak(behandlingId, Vedtak);
                    }}
                >
                    Lagre vedtak
                </Button>
            </HStack>
        </VStack>
    );
};
