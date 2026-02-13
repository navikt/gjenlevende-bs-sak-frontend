import React, {useState} from "react";
import type { Vedtak } from "~/komponenter/behandling/vedtak/vedtak";
import {useLagreVedtak} from "~/hooks/useLagreVedtak";
import {Button, HStack, MonthPicker, Textarea, useMonthpicker} from "@navikt/ds-react";
import {useParams} from "react-router";
import {format} from "date-fns";


export const OppgørVedtak: React.FC<{ lagretVedtak: Vedtak | null }> = ({lagretVedtak}) => {
    const {lagreVedtak} = useLagreVedtak();
    const {behandlingId} = useParams<{ behandlingId: string }>();
    const {monthpickerProps, inputProps, selectedMonth} = useMonthpicker({
        defaultSelected: lagretVedtak?.opphørFom ? new Date(lagretVedtak.opphørFom) : undefined,
    });

    const [begrunnelse, settBegrunnelse] = useState<string>(lagretVedtak?.begrunnelse ?? "");

    function handleLagreVedtak() {
        if (!behandlingId || !selectedMonth) return;
        const Vedtak = {
            resultatType: 'OPPHØR' as const,
            begrunnelse: begrunnelse,
            barnetilsynperioder: [],
            opphørFom: format(selectedMonth, 'yyyy-MM')
        };
        lagreVedtak(behandlingId, Vedtak);
    }

    return (
        <>
            <MonthPicker {...monthpickerProps}>
                <MonthPicker.Input
                    {...inputProps}
                    label="Velg måned"
                />
            </MonthPicker>
            <Textarea label={'Begrunnelse'} value={begrunnelse}
                      onChange={e => settBegrunnelse(e.target.value)}></Textarea>
            <HStack>
                <Button size="medium" onClick={() => handleLagreVedtak()}>
                    Lagre vedtak
                </Button>
            </HStack>
        </>
    )
};