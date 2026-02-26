import React from "react";
import { BodyLong, Button, HStack, Modal } from "@navikt/ds-react";

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  sender: boolean;
  onSendTilBeslutter: () => void;
}

export function SendTilBeslutterModal({ modalRef, sender, onSendTilBeslutter }: Props) {
  const lukkModal = () => modalRef.current?.close();

  return (
    <Modal ref={modalRef} header={{ heading: "Totrinnskontroll" }}>
      <Modal.Body>
        <BodyLong>
          Du er i ferd med å sende behandlingen til totrinnskontroll. Vil du fortsette?
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="space-4" justify="end">
          <Button
            onClick={() => {
              onSendTilBeslutter();
              lukkModal();
            }}
            disabled={sender}
          >
            Send til beslutter
          </Button>
          <Button variant="secondary" onClick={lukkModal} disabled={sender}>
            Avbryt
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  );
}
