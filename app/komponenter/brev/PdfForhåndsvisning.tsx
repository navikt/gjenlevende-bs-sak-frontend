import { Document, Font, Image, Page, StyleSheet, Text, usePDF, View } from "@react-pdf/renderer";
import React, { useEffect, useMemo, useState } from "react";
import type { Brevmal, Tekstbolk } from "~/komponenter/brev/typer";
import { Alert, Loader, VStack } from "@navikt/ds-react";
import cssStyles from "./PdfForhåndsvisning.module.css";

Font.register({
  family: "Source Sans 3",
  fonts: [
    { src: "/fonts/SourceSans3-Regular.ttf" },
    { src: "/fonts/SourceSans3-Bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingBottom: 74,
    paddingHorizontal: 64,
    fontSize: 11,
    fontFamily: "Source Sans 3",
    color: "#000000",
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 48,
  },
  logo: {
    height: 16,
    alignSelf: "flex-start",
    objectFit: "contain",
  },
  infoBlokk: {
    marginBottom: 26,
  },
  fnrDatoRad: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dato: {
    fontSize: 11,
    color: "#000000",
  },
  tittel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 0,
    lineHeight: 1.25,
    letterSpacing: 0.3,
  },
  brukerInfo: {
    lineHeight: 1.4,
  },
  seksjon: {
    marginBottom: 0,
  },
  underoverskrift: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 26,
    marginBottom: 8,
    lineHeight: 1.23,
    letterSpacing: 0.25,
  },
  avsnitt: {
    lineHeight: 1.4,
    marginBottom: 0,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 9,
    bottom: 26,
    right: 0,
    textAlign: "right",
    color: "#000000",
  },
});

interface Props {
  brevmal: Brevmal | null;
  fritekstbolker: Tekstbolk[];
}

const TekstAvsnitt = ({ tekst }: { tekst: string }) => {
  const avsnitt = tekst
    .split("\n")
    .map((a) => a.trim())
    .filter((a) => a.length > 0);

  return (
    <>
      {avsnitt.map((a, i) => (
        <Text key={i} style={i > 0 ? [styles.avsnitt, { marginTop: 16 }] : styles.avsnitt} orphans={3} widows={3}>
          {a}
        </Text>
      ))}
    </>
  );
};

const BrevDokument = ({ brevmal, fritekstbolker }: Props) => {
  const NAV_LOGO_PATH = "/Nav-logo-red-228x63.png";

  return (
    <Document>
      {brevmal && (
        <Page size="A4" style={styles.page} wrap>
          <View style={styles.header}>
            <Image src={NAV_LOGO_PATH} style={styles.logo} />
          </View>

          <View style={styles.infoBlokk}>
            <Text style={styles.brukerInfo}>Navn: {brevmal.informasjonOmBruker.navn}</Text>
            <View style={styles.fnrDatoRad}>
              <Text style={styles.brukerInfo}>Fnr: {brevmal.informasjonOmBruker.fnr}</Text>
              <Text style={styles.dato}>
                {new Date().toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </Text>
            </View>
          </View>

          <Text style={styles.tittel}>{brevmal.tittel}</Text>

          {fritekstbolker.map((fritekstbolk, index) => {
            const harOverskrift = !!fritekstbolk.underoverskrift?.trim();
            return (
              <View key={index} style={harOverskrift ? styles.seksjon : [styles.seksjon, { marginTop: 26 }]}>
                {harOverskrift && (
                  <Text style={styles.underoverskrift} minPresenceAhead={20}>
                    {fritekstbolk.underoverskrift}
                  </Text>
                )}
                <TekstAvsnitt tekst={fritekstbolk.innhold} />
              </View>
            );
          })}

          {brevmal.fastTekstAvslutning?.map((fastTekst, index) => {
            const harOverskrift = !!fastTekst.underoverskrift?.trim();
            return (
              <View key={index} style={harOverskrift ? styles.seksjon : [styles.seksjon, { marginTop: 26 }]} wrap={false}>
                {harOverskrift && (
                  <Text style={styles.underoverskrift}>{fastTekst.underoverskrift}</Text>
                )}
                <TekstAvsnitt tekst={fastTekst.innhold} />
              </View>
            );
          })}

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`}
            fixed
          />
        </Page>
      )}
    </Document>
  );
};

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

  const dokument = useMemo(
    () => <BrevDokument brevmal={debouncedBrevmal} fritekstbolker={debouncedFritekstbolker} />,
    [debouncedBrevmal, debouncedFritekstbolker]
  );

  const [instance, oppdaterInstans] = usePDF({ document: dokument });

  useEffect(() => {
    oppdaterInstans(dokument);
  }, [dokument, oppdaterInstans]);

  if (typeof window === "undefined") return null;

  if (instance.loading) {
    return (
      <VStack align="center" justify="center" height="100%">
        <Loader size="xlarge" title="Genererer PDF..." />
      </VStack>
    );
  }

  if (instance.error) {
    return <Alert variant="error">Feil ved generering av PDF: {String(instance.error)}</Alert>;
  }

  const iframeUrl = instance.url ? `${instance.url}#toolbar=0&navpanes=0&view=FitH` : undefined;

  return (
    <iframe
      src={iframeUrl}
      title="PDF forhåndsvisning"
      className={cssStyles.pdfIframe}
    />
  );
};
