import React, {useState} from "react";
import {EResultatType, type IVedtak} from "~/komponenter/behandling/vedtak/vedtak";
import {useLagreVedtak} from "~/hooks/useLagreVedtak";
import {Button, HStack, MonthPicker, Textarea, useMonthpicker} from "@navikt/ds-react";
import {useParams} from "react-router";
import {format} from "date-fns";


export const OppgørVedtak: React.FC<{lagretVedtak: IVedtak | null}> = ({lagretVedtak}) => {
    const { lagreVedtak } = useLagreVedtak();
    const { behandlingId } = useParams<{ behandlingId: string }>();
    const { monthpickerProps, inputProps, selectedMonth } = useMonthpicker({
        defaultSelected: lagretVedtak?.opphørFom ? new Date(lagretVedtak.opphørFom) : undefined,
    });

    const [begrunnelse, setBegrunnelse] = useState<string>(lagretVedtak?.begrunnelse ? String(lagretVedtak.begrunnelse) : "");

    return (
        <>
            <MonthPicker {...monthpickerProps}>
                <MonthPicker.Input
                    {...inputProps}
                    label="Velg måned"
                />
            </MonthPicker>
            <Textarea label={'Begrunnelse'} value={begrunnelse} onChange={e => setBegrunnelse(e.target.value)}></Textarea>
            <HStack>
                <Button size="medium"
                        onClick={() => {
                            if (!behandlingId || !selectedMonth) return;
                            const mockVedtak = {
                                resultatType: EResultatType.OPPHØR,
                                begrunnelse: begrunnelse,
                                barnetilsynperioder: [],
                                opphørFom: format(selectedMonth, 'yyyy-MM')
                            };
                            lagreVedtak(behandlingId, mockVedtak);
                        }}
                >
                    Lagre vedtak
                </Button>
            </HStack>
        </>
    )
};