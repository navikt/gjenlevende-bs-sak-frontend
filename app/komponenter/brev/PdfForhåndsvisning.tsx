import { Document, Image, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";
import React, { useEffect, useMemo, useState } from "react";
import type { Brevmal, Tekstbolk } from "~/komponenter/brev/typer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10, fontSize: 12 },
  header: {
    flexDirection: "column",
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: "contain",
  },
  underoverskrift: {
    fontWeight: "bold",
  },
});

interface Props {
  brevmal: Brevmal | null;
  fritekstbolker: Tekstbolk[];
}

export const PdfForhåndsvisning = ({ brevmal, fritekstbolker }: Props) => {
  const [debouncedBrevmal, settDebouncedBrevmal] = useState(brevmal);
  const [debouncedFritekstbolker, settDebouncedFritekstbolker] = useState(fritekstbolker);

  const NAV_LOGO_PATH = "/Nav-logo-red-228x63.png";

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
              <Image src={NAV_LOGO_PATH} style={styles.logo} />
              <View>
                <Text style={{ fontSize: 9 }}>Dato: {new Date().toLocaleDateString("nb-NO")}</Text>
              </View>
            </View>
            <Text>{debouncedBrevmal?.tittel}</Text>
            <View style={styles.section}>
              <Text>Navn: {debouncedBrevmal?.informasjonOmBruker.navn}</Text>
              <Text>Fnr: {debouncedBrevmal?.informasjonOmBruker.fnr}</Text>
            </View>
            {debouncedFritekstbolker && (
              <View
                style={styles.section}
                render={() =>
                  debouncedFritekstbolker.map((fritekstbolk, index) => (
                    <View key={index}>
                      <Text style={styles.underoverskrift}>{fritekstbolk.underoverskrift}</Text>
                      <Text>{fritekstbolk.innhold}</Text>
                    </View>
                  ))
                }
              ></View>
            )}
            <View style={styles.section}>
              {debouncedBrevmal.fastTekstAvslutning &&
                debouncedBrevmal.fastTekstAvslutning.map((fastTekst, index) => (
                  <View key={index}>
                    {fastTekst.underoverskrift && (
                      <Text style={styles.underoverskrift}>{fastTekst.underoverskrift}</Text>
                    )}
                    <Text style={styles.section}>{fastTekst.innhold}</Text>
                  </View>
                ))}
            </View>
          </Page>
        )}
      </Document>
    ),
    [debouncedBrevmal, debouncedFritekstbolker]
  );

  if (typeof window === "undefined") return null; //Sjekk ut

  return (
    <PDFViewer width={"100%"} height="700px" showToolbar={false}>
      {pdfInnhold}
    </PDFViewer>
  );
};
