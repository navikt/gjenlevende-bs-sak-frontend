import React from "react";
import { BodyLong, Button, HStack, Modal } from "@navikt/ds-react";

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  sender: boolean;
  onHoppOver: () => void;
  onSendTilBeslutter: () => void;
}

export function HoppOverTotrinnskontrollModal({
  modalRef,
  sender,
  onHoppOver,
  onSendTilBeslutter,
}: Props) {
  const lukkModal = () => modalRef.current?.close();

  return (
    <Modal ref={modalRef} header={{ heading: "Totrinnskontroll" }}>
      <Modal.Body>
        <BodyLong>
          Toggle for å hoppe over totrinnskontroll er aktiv. Du kan velge å hoppe over godkjenning
          slik at behandlingen ferdigstilles med en gang, eller følge normal flyt og sende til
          beslutter.
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="space-4" justify="end">
          <Button
            onClick={() => {
              onHoppOver();
              lukkModal();
            }}
            disabled={sender}
          >
            Hopp over godkjenning
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onSendTilBeslutter();
              lukkModal();
            }}
            disabled={sender}
          >
            Send til beslutter
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  );
}
