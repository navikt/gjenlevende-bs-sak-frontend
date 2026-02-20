import React from "react";
import { Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";

export default function BrevV2() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 13rem)" }}>
      <VStack gap="space-24" style={{ flex: 1 }}>
        <Heading size="large">Brev</Heading>

        <Box
          shadow="dialog"
          background="neutral-soft"
          padding="space-24"
          borderRadius="4"
          style={{ flex: 1 }}
        />

        <HStack justify="space-between">
          <Button variant="tertiary">Tilbake</Button>
          <HStack gap="space-24">
            <Button variant="secondary">Send pdf til sak</Button>
            <Button>Send til beslutter</Button>
          </HStack>
        </HStack>
      </VStack>
    </div>
  );
}
