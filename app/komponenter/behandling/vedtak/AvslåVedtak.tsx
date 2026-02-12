import React, {useState} from "react";
import {ResultatType, type Vedtak} from "~/komponenter/behandling/vedtak/vedtak";
import {useLagreVedtak} from "~/hooks/useLagreVedtak";
import {Button, HStack, Textarea} from "@navikt/ds-react";
import {useParams} from "react-router";


export const AvslåVedtak: React.FC<{ lagretVedtak: Vedtak | null }> = ({lagretVedtak}) => {
    const {lagreVedtak} = useLagreVedtak();
    const {behandlingId} = useParams<{ behandlingId: string }>();

    const [begrunnelse, settBegrunnelse] = useState<string>(lagretVedtak?.begrunnelse ?? "");

    function handleLagreVedtak() {
        if (!behandlingId) return;
        const Vedtak = {
            resultatType: ResultatType.AVSLÅTT,
            begrunnelse: begrunnelse,
            barnetilsynperioder: [],
        };
        lagreVedtak(behandlingId, Vedtak);
    }

    return (
        <>
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