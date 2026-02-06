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
    Label,
    Select,
    UNSAFE_Combobox,
    TextField,
    Button, Textarea, HStack, VStack, MonthPicker
} from "@navikt/ds-react";
import { TrashIcon } from '@navikt/aksel-icons';
import styles from "./Grid.module.css";
import {useHentBeløpsPerioderForVedtak} from "~/hooks/useHentBeløpsPerioderForVedtak";

interface GridProps {
    lesevisning?: boolean;
    children: React.ReactNode;
}

const GridComponent: React.FC<GridProps> = ({ lesevisning, children }) => (
    <div className={lesevisning ? `${styles.grid} ${styles.lesevisning}` : styles.grid}>
        {children}
    </div>
);

const GridLiten: React.FC<GridProps> = ({ lesevisning, children }) => (
    <div className={lesevisning ? `${styles.gridLiten} ${styles.lesevisning}` : styles.gridLiten}>
        {children}
    </div>
);

function månedStringTilDatoString(value: string | undefined): string {
    if (!value) return ''
    const månederStrings = [
        'januar', 'februar', 'mars', 'april', 'mai', 'juni',
        'juli', 'august', 'september', 'oktober', 'november', 'desember'
    ];
    const [månedNavn, årString] = value.trim().split(' ');
    const måned = månederStrings.indexOf((månedNavn || '').toLowerCase());
    const year = Number(årString);
    if (måned >= 0 && year >= 1000 && year <= 9999) {
        const mm = String(måned + 1).padStart(2, '0');
        return `${year}-${mm}`;
    }
    return ''
}

function formatToNorwegianMonthYear(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('nb-NO', { month: 'long', year: 'numeric' });
}

export const InnvilgeVedtak: React.FC<{lagretVedtak: IVedtak | null}> = ({lagretVedtak}) => {
    const lagretPerioder = lagretVedtak?.barnetilsynperioder || [];
    const { behandlingId } = useParams<{ behandlingId: string }>();
    const { lagreVedtak } = useLagreVedtak();
    const { beløpsperioderDto, hent } = useHentBeløpsPerioderForVedtak();
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
            <GridComponent>
                <Label>Periodetype</Label>
                <Label>Aktivitet</Label>
                <Label>Periode fra og med</Label>
                <Label>Periode til og med</Label>
                <Label>Velg barn</Label>
                <Label>Antall barn</Label>
                <Label>Utgifter</Label>
                <Label> </Label>
                {perioder.map((periode, index) => (
                    <React.Fragment key={index}>
                        <Select label="Periodetype" value={periode.periodetype} onChange={e => handlePeriodeChange(index, 'periodetype', e.target.value as EPeriodetype)} hideLabel>
                            <option value="">Velg</option>
                            <option value={EPeriodetype.ORDINÆR}>Ordinær</option>
                            <option value={EPeriodetype.INGEN_STØNAD}>Ingen stønad</option>
                        </Select>
                        <Select label="Aktivitet" value={periode.aktivitetstype} onChange={e => handlePeriodeChange(index, 'aktivitetstype', e.target.value as EAktivitetstypeBarnetilsyn)} hideLabel>
                            <option value="">Velg</option>
                            <option value={EAktivitetstypeBarnetilsyn.I_ARBEID}>I arbeid</option>
                            <option value={EAktivitetstypeBarnetilsyn.FORBIGÅENDE_SYKDOM}>Forbigående sykdom</option>
                        </Select>
                        <MonthPicker
                            selected={periode.datoFra ? new Date(periode.datoFra) : undefined}
                            onMonthSelect={date => handlePeriodeMonthChange(index, 'datoFra', date ? månedStringTilDatoString(date.toLocaleString('nb-NO', { month: 'long', year: 'numeric' })) : '')}
                        >
                            <MonthPicker.Input
                                label="Fra og med"
                                hideLabel
                                value={formatToNorwegianMonthYear(periode.datoFra)}
                                onChange={e => handlePeriodeMonthChange(index, 'datoFra', e.target.value)}
                                description="Format: mm.åååå"
                            />
                        </MonthPicker>
                        <MonthPicker
                            selected={periode.datoTil ? new Date(periode.datoTil) : undefined}
                            onMonthSelect={date => handlePeriodeMonthChange(index, 'datoTil', date ? månedStringTilDatoString(date.toLocaleString('nb-NO', { month: 'long', year: 'numeric' })) : '')}
                        >
                            <MonthPicker.Input
                                label="Til og med"
                                hideLabel
                                value={formatToNorwegianMonthYear(periode.datoTil)}
                                onChange={e => handlePeriodeMonthChange(index, 'datoTil', e.target.value)}
                                description="Format: mm.åååå"
                            />
                        </MonthPicker>
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
                        <span>{periode.barn.length}</span>
                        <TextField label="Utgifter" value={periode.utgifter} onChange={e => handlePeriodeChange(index, 'utgifter', Number(e.target.value))} hideLabel />
                        <TrashIcon onClick={() => slettPeriode(index)} fontSize="1.5rem"></TrashIcon>
                    </React.Fragment>
                ))}
            </GridComponent>
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
            {beløpsperioderDto && (
            <GridLiten>
                <Label>Periode</Label>
                <Label>Antall barn</Label>
                <Label>Utgifter</Label>
                <Label>Stønadsbeløp pr mnd</Label>
                {beløpsperioderDto.map((periode, idx) => (
                    <React.Fragment key={idx}>
                        <span>{periode.datoFra} - {periode.datoTil}</span>
                        <span>{periode.antallBarn}</span>
                        <span>{periode.utgifter}</span>
                        <span>{periode.beløp}</span>
                    </React.Fragment>
                ))}
            </GridLiten>
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
