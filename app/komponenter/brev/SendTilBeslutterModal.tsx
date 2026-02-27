import React from "react";
import { BodyLong, Button, HStack, Modal } from "@navikt/ds-react";

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  laster: boolean;
  onSendTilBeslutter: () => void;
}

export function SendTilBeslutterModal({ modalRef, laster, onSendTilBeslutter }: Props) {
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
            disabled={laster}
          >
            Send til beslutter
          </Button>
          <Button variant="secondary" onClick={lukkModal} disabled={laster}>
            Avbryt
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  );
}
