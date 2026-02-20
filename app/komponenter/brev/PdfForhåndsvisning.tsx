import { Document, Image, Page, StyleSheet, Text, usePDF, View } from "@react-pdf/renderer";
import React, { useEffect, useMemo, useState } from "react";
import type { Brevmal, Tekstbolk } from "~/komponenter/brev/typer";
import { Alert, Loader, VStack } from "@navikt/ds-react";
import cssStyles from "./PdfForhåndsvisning.module.css";

const styles = StyleSheet.create({
  page: {
    paddingTop: 52,
    paddingBottom: 72,
    paddingHorizontal: 62,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "column",
    marginBottom: 28,
  },
  logo: {
    width: 80,
    height: 40,
    objectFit: "contain",
  },
  dato: {
    fontSize: 11,
    color: "#333",
    marginTop: 6,
  },
  tittel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 24,
  },
  brukerInfo: {
    marginBottom: 28,
    lineHeight: 1.4,
  },
  seksjon: {
    marginBottom: 14,
  },
  underoverskrift: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  avsnitt: {
    lineHeight: 0.95,
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#999",
    marginTop: 8,
    marginBottom: 16,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 28,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#666",
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
        <Text key={i} style={styles.avsnitt} orphans={3} widows={3}>
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
            <Text style={styles.dato}>
              Dato: {new Date().toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" })}
            </Text>
          </View>

          <Text style={styles.tittel}>{brevmal.tittel}</Text>

          <View style={styles.brukerInfo}>
            <Text>Navn: {brevmal.informasjonOmBruker.navn}</Text>
            <Text>Fnr: {brevmal.informasjonOmBruker.fnr}</Text>
          </View>

          {fritekstbolker.map((fritekstbolk, index) => (
            <View key={index} style={styles.seksjon}>
              {fritekstbolk.underoverskrift?.trim() && (
                <Text style={styles.underoverskrift} minPresenceAhead={20}>
                  {fritekstbolk.underoverskrift}
                </Text>
              )}
              <TekstAvsnitt tekst={fritekstbolk.innhold} />
            </View>
          ))}

          {brevmal.fastTekstAvslutning && brevmal.fastTekstAvslutning.length > 0 && (
            <View style={styles.separator} />
          )}

          {brevmal.fastTekstAvslutning?.map((fastTekst, index) => (
            <View key={index} style={styles.seksjon} wrap={false}>
              {fastTekst.underoverskrift?.trim() && (
                <Text style={styles.underoverskrift}>{fastTekst.underoverskrift}</Text>
              )}
              <TekstAvsnitt tekst={fastTekst.innhold} />
            </View>
          ))}

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
    return <Alert variant="error">Feil ved generering av PDF: {instance.error}</Alert>;
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
