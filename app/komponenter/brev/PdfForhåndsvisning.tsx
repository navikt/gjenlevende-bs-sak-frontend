import { Document, Image, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import React, { useEffect, useMemo, useState } from 'react';
import type { BrevMal, FritekstBolk } from '~/komponenter/brev/BrevSide';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  header: {
    flexDirection: 'column',
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
  },
  underoverskrift: {
    fontWeight: 'bold',
  },
});

interface Props {
  brevmal: BrevMal | null;
  fritekstbolker: FritekstBolk[];
}

export const PdfForhåndsvisning = ({ brevmal, fritekstbolker }: Props) => {
  const [debouncedBrevmal, settDebouncedBrevmal] = useState(brevmal);
  const [debouncedFritekstbolker, settDebouncedFritekstbolker] = useState(fritekstbolker);

  useEffect(() => {
    const timer = setTimeout(() => {
      settDebouncedBrevmal(brevmal);
      settDebouncedFritekstbolker(fritekstbolker);
    }, 1000);

    return () => clearTimeout(timer);
  }, [brevmal, fritekstbolker]);

  const pdfInnhold = useMemo(
    () => (
      <Document>
        {debouncedBrevmal && (
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Image src="/Nav-logo-red-228x63.png" style={styles.logo} />
              <View>
                <Text style={{ fontSize: 9 }}>Dato: {new Date().toLocaleDateString('nb-NO')}</Text>
              </View>
            </View>
            <View>{debouncedBrevmal?.tittel}</View>
            <View style={styles.section}>
              <Text>Navn: {debouncedBrevmal?.fastTekstInfo.navn}</Text>
              <Text>Fnr: {debouncedBrevmal?.fastTekstInfo.fnr}</Text>
            </View>
            {debouncedFritekstbolker && (
              <View style={styles.section}>
                {debouncedFritekstbolker.map((fritekstbolk, index) => (
                  <View key={index}>
                    <Text style={styles.underoverskrift}>{fritekstbolk.deltittel}</Text>
                    <Text>{fritekstbolk.innhold}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.section}>
              <Text>{debouncedBrevmal?.fastTekstAvslutning}</Text>
            </View>
          </Page>
        )}
      </Document>
    ),
    [debouncedBrevmal, debouncedFritekstbolker]
  );

  if (typeof window === 'undefined') return null; //Sjekk ut

  return (
    <PDFViewer width={'100%'} height="700px" showToolbar={false}>
      {pdfInnhold}
    </PDFViewer>
  );
};
