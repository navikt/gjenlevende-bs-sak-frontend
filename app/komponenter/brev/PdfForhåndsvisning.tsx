import { Document, Image, Page, StyleSheet, Text, usePDF, View } from "@react-pdf/renderer";
import React, { useEffect, useMemo, useState } from "react";
import type { Brevmal, Tekstbolk } from "~/komponenter/brev/typer";
import { Loader } from "@navikt/ds-react";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 60,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "column",
    paddingBottom: 16,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: "contain",
  },
  dato: {
    fontSize: 9,
    color: "#555",
    marginTop: 4,
  },
  tittel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  brukerInfo: {
    marginBottom: 16,
    padding: 8,
    fontSize: 11,
  },
  fritekstbolk: {
    marginBottom: 12,
  },
  underoverskrift: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  innhold: {
    lineHeight: 1.5,
  },
  avslutning: {
    marginTop: 8,
    marginBottom: 8,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 9,
    bottom: 24,
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

const BrevDokument = ({ brevmal, fritekstbolker }: Props) => {
  const NAV_LOGO_PATH = "/Nav-logo-red-228x63.png";

  return (
    <Document>
      {brevmal && (
        <Page size="A4" style={styles.page} wrap>
          <View style={styles.header}>
            <Image src={NAV_LOGO_PATH} style={styles.logo} />
            <Text style={styles.dato}>Dato: {new Date().toLocaleDateString("nb-NO")}</Text>
          </View>

          <Text style={styles.tittel}>{brevmal.tittel}</Text>

          <View style={styles.brukerInfo}>
            <Text>Navn: {brevmal.informasjonOmBruker.navn}</Text>
            <Text>Fnr: {brevmal.informasjonOmBruker.fnr}</Text>
          </View>

          {fritekstbolker.map((fritekstbolk, index) => (
            <View key={index} style={styles.fritekstbolk} wrap={false} minPresenceAhead={40}>
              {fritekstbolk.underoverskrift && (
                <Text style={styles.underoverskrift}>{fritekstbolk.underoverskrift}</Text>
              )}
              <Text style={styles.innhold}>{fritekstbolk.innhold}</Text>
            </View>
          ))}

          {brevmal.fastTekstAvslutning?.map((fastTekst, index) => (
            <View key={index} style={styles.avslutning} wrap={false}>
              {fastTekst.underoverskrift && (
                <Text style={styles.underoverskrift}>{fastTekst.underoverskrift}</Text>
              )}
              <Text style={styles.innhold}>{fastTekst.innhold}</Text>
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Loader size="xlarge" title="Genererer PDF..." />
      </div>
    );
  }

  if (instance.error) {
    return <div>Feil ved generering av PDF: {instance.error}</div>;
  }

  const iframeUrl = instance.url ? `${instance.url}#toolbar=0&navpanes=0&view=FitH` : undefined;

  return (
    <iframe
      src={iframeUrl}
      title="PDF forhåndsvisning"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        backgroundColor: "#f5f5f5",
      }}
    />
  );
};
