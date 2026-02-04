import React, {useState} from "react";
import {EResultatType, type IVedtak} from "~/komponenter/behandling/vedtak/vedtak";
import {useLagreVedtak} from "~/hooks/useLagreVedtak";
import {Button, HStack, Textarea, VStack} from "@navikt/ds-react";
import {useParams} from "react-router";


export const AvslåVedtak: React.FC<{lagretVedtak: IVedtak | null}> = ({lagretVedtak}) => {
    const { lagreVedtak } = useLagreVedtak();
    const { behandlingId } = useParams<{ behandlingId: string }>();

    const [begrunnelse, setBegrunnelse] = useState<string>(lagretVedtak?.begrunnelse ? String(lagretVedtak.begrunnelse) : "");

    return (
        <>
            <Textarea label={'Begrunnelse'} value={begrunnelse} onChange={e => setBegrunnelse(e.target.value)}></Textarea>
            <HStack>
                <Button size="medium"
                    onClick={() => {
                        if (!behandlingId) return;
                        const mockVedtak = {
                            resultatType: EResultatType.AVSLÅTT,
                            begrunnelse: begrunnelse,
                            barnetilsynperioder: [],
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