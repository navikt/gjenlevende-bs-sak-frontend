import {Box, Button, HGrid, Select, VStack} from '@navikt/ds-react';
import React, {useState} from 'react';
import {FritekstFelt} from '~/komponenter/brev/FritekstFelt';
import {PlusIcon} from '@navikt/aksel-icons';
import {PdfForhåndsvisning} from "~/komponenter/brev/PdfForhåndsvisning";

// import { Side } from '~/komponenter/layout/Side';

export interface BrevMal {
    tittel: string;
    fastTekstInfo: FasttekstInfo;
    fastTekstAvslutning: string;
}

export interface FasttekstInfo {
    navn: string,
    fnr: string,
}

export interface FritekstBolk {
    deltittel: string;
    innhold: string;
}

const brevMaler: BrevMal[] = [
    {
        tittel: 'brevmalTittel1',
        fastTekstInfo: {navn: "navn navnesen", fnr: "123"},
        fastTekstAvslutning: 'Dette er en avslutning 1',
    },
    {
        tittel: 'brevmalTittel2',
        fastTekstInfo: {navn: "navn navnesen", fnr: "123"},
        fastTekstAvslutning: 'Dette er en avslutning 2',
    },
    {
        tittel: 'brevmalTittel3',
        fastTekstInfo: {navn: "navn navnesen", fnr: "123"},
        fastTekstAvslutning: 'Dette er en avslutning 3',
    },
];

export const BrevSide = () => {
    const [brevMal, settBrevmal] = useState<BrevMal | null>(null);
    const [fritekstFelter, settFritekstfelter] = useState<FritekstBolk[]>([]);

    const leggTilFritekstfelt = () => {
        settFritekstfelter((prev) => [...prev, {deltittel: '', innhold: ''}]);
    };

    const flyttFritekstfeltOpp = (index: number) => {
        settFritekstfelter((prev) => {
            if (index === 0) return prev;
            const newArr = [...prev];
            [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
            return newArr;
        });
    };

    const flyttFritekstfeltNed = (index: number) => {
        settFritekstfelter((prev) => {
            if (index === prev.length - 1) return prev;
            const newArr = [...prev];
            [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
            return newArr;
        });
    };

    const oppdaterFelt = (index: number, partial: Partial<FritekstBolk>) => {
        settFritekstfelter((prev) => {
            const newArr = [...prev];
            newArr[index] = {...newArr[index], ...partial};
            return newArr;
        });
    };

    const handleSelect = (brevmal: string): void => {
        if (brevmal === '') {
            settBrevmal(null);
        } else {
            const valgtBrevmal = brevMaler.find((b) => b.tittel === brevmal) ?? null;
            settBrevmal(valgtBrevmal);
        }
    };

    return (
        // <Side>
        <HGrid gap="32" columns={2}>
            <Box style={{backgroundColor: "white", alignSelf: "flex-start"}} borderRadius="small" padding={"space-16"}>
                <Select
                    label="Velg dokument"
                    onChange={(e) => {
                        handleSelect(e.target.value);
                    }}
                    size={'small'}
                >
                    <option value="">Ikke valgt</option>
                    {brevMaler.map((brevmal) => (
                        <option key={brevmal.tittel} value={brevmal.tittel}>
                            {brevmal.tittel}
                        </option>
                    ))}
                </Select>
                {brevMal && (
                    <VStack gap={'2'}>
                        <h3>Fritekstområde</h3>
                        {fritekstFelter.map((fritekstfelt, index) => (
                            <FritekstFelt
                                key={index}
                                deltittel={fritekstfelt.deltittel}
                                innhold={fritekstfelt.innhold}
                                handleOppdaterFelt={(partial) => oppdaterFelt(index, partial)}
                                handleFlyttOpp={() => flyttFritekstfeltOpp(index)}
                                handleFlyttNed={() => flyttFritekstfeltNed(index)}
                                fritekstfeltListe={fritekstFelter}
                            />
                        ))}
                        <Button
                            variant={'secondary'}
                            icon={<PlusIcon title={'Legg til fritekstfelt'}/>}
                            onClick={leggTilFritekstfelt}
                            size={'small'}
                        >
                            Legg til fritekstfelt
                        </Button>
                    </VStack>
                )}
            </Box>
            <Box>
                <VStack gap={"4"} align={"center"}>
                    <PdfForhåndsvisning brevmal={brevMal} fritekstbolker={fritekstFelter}/>
                    <Button style={{width: "fit-content"}}>Send til beslutter</Button>
                </VStack>
            </Box>
        </HGrid>
        // </Side>
    );
};
