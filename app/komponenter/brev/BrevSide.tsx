import { Box, Button, Heading, HGrid, Select, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import { Fritekstbolk } from '~/komponenter/brev/Fritekstbolk';
import { PlusIcon } from '@navikt/aksel-icons';
import { PdfForhåndsvisning } from '~/komponenter/brev/PdfForhåndsvisning';

export interface BrevMal {
  tittel: string;
  fastTekstInfo: FasttekstInfo;
  fastTekstAvslutning: string;
}

export interface FasttekstInfo {
  navn: string;
  fnr: string;
}

export interface FritekstBolk {
  deltittel: string;
  innhold: string;
}

const brevMaler: BrevMal[] = [
  {
    tittel: 'brevmalTittel1',
    fastTekstInfo: { navn: 'navn navnesen', fnr: '123' },
    fastTekstAvslutning: 'Dette er en avslutning 1',
  },
  {
    tittel: 'brevmalTittel2',
    fastTekstInfo: { navn: 'navn navnesen', fnr: '123' },
    fastTekstAvslutning: 'Dette er en avslutning 2',
  },
  {
    tittel: 'brevmalTittel3',
    fastTekstInfo: { navn: 'navn navnesen', fnr: '123' },
    fastTekstAvslutning: 'Dette er en avslutning 3',
  },
];

export interface SendPdfTilSakRequest {
  brevmal: BrevMal;
  fritekstbolker: FritekstBolk[];
}

export const BrevSide = () => {
  const [brevMal, settBrevmal] = useState<BrevMal | null>(null);
  const [fritekstbolker, settFritekstbolker] = useState<FritekstBolk[]>([]);
  const [laster, settLaster] = useState<boolean>(false);
  const [feilmelding, settFeilmelding] = useState<string>(); //TODO logg feilmelding riktig

  const leggTilFritekstbolk = () => {
    settFritekstbolker((prev) => [...prev, { deltittel: '', innhold: '' }]);
  };

  const flyttBolkOpp = (index: number) => {
    settFritekstbolker((prev) => {
      if (index === 0) return prev;
      const newArr = [...prev];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      return newArr;
    });
  };

  const flyttBolkNed = (index: number) => {
    settFritekstbolker((prev) => {
      if (index === prev.length - 1) return prev;
      const newArr = [...prev];
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  const oppdaterFelt = (index: number, partial: Partial<FritekstBolk>) => {
    settFritekstbolker((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], ...partial };
      return newArr;
    });
  };

  const velgBrevmal = (brevmal: string): void => {
    if (brevmal === '') {
      settBrevmal(null);
    } else {
      const valgtBrevmal = brevMaler.find((b) => b.tittel === brevmal) ?? null;
      settBrevmal(valgtBrevmal);
    }
  };

  const sendPdfTilSak = async (brevmal: BrevMal, fritekstbolker: FritekstBolk[]) => {
    if (laster) return;
    settLaster(true);
    settFeilmelding(undefined);

    const behandlingsID = 123; // TODO: Hent riktig behandlingsID

    try {
      const response = await fetch(`/familie-bs-sak/api/${behandlingsID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brevmal: brevmal,
          fritekstbolker: fritekstbolker,
        }),
      });

      if (!response.ok) {
        settFeilmelding('Feil ved sending av PDF');
      }
    } catch (error) {
      settFeilmelding(`En feil oppstod: , ${error}`);
    } finally {
      settLaster(false);
    }
  };

  return (
    <HGrid gap="32" columns={2} width={'100%'}>
      <Box
        style={{ backgroundColor: 'white', alignSelf: 'flex-start' }}
        borderRadius="small"
        padding={'space-16'}
      >
        <VStack gap={'4'}>
          <Select
            label="Velg dokument"
            value={brevMal?.tittel ?? ''}
            onChange={(e) => {
              velgBrevmal(e.target.value);
            }}
            size={'small'}
          >
            <option value="" disabled>
              Ikke valgt
            </option>
            {brevMaler.map((brevmal) => (
              <option key={brevmal.tittel} value={brevmal.tittel}>
                {brevmal.tittel}
              </option>
            ))}
          </Select>
          {brevMal && (
            <VStack gap={'2'}>
              <Heading level={'3'} size={'small'} spacing>
                Fritekstområde
              </Heading>
              {fritekstbolker.map((fritekstfelt, index) => (
                <Fritekstbolk
                  key={index}
                  deltittel={fritekstfelt.deltittel}
                  innhold={fritekstfelt.innhold}
                  handleOppdaterFelt={(partial) => oppdaterFelt(index, partial)}
                  handleFlyttOpp={() => flyttBolkOpp(index)}
                  handleFlyttNed={() => flyttBolkNed(index)}
                  fritekstfeltListe={fritekstbolker}
                />
              ))}
              <Button
                variant={'secondary'}
                icon={<PlusIcon title={'Legg til fritekstfelt'} />}
                onClick={leggTilFritekstbolk}
                size={'small'}
              >
                Legg til fritekstfelt
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
      <Box>
        <VStack gap={'4'} align={'center'}>
          <PdfForhåndsvisning brevmal={brevMal} fritekstbolker={fritekstbolker} />
          {brevMal && fritekstbolker && (
            <Button
              style={{ width: 'fit-content' }}
              onClick={() => sendPdfTilSak(brevMal, fritekstbolker)}
            >
              Send pdf til sak{' '}
            </Button>
          )}
          {/* //TODO Knappen over skal bli "Send til beslutter" etterhvert*/}
        </VStack>
      </Box>
    </HGrid>
  );
};
