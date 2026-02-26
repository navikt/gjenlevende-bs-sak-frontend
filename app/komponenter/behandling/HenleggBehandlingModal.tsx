import React from "react";
import { BodyLong, Button, HStack, Modal } from "@navikt/ds-react";

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  henlegger: boolean;
  onHenlegg: () => Promise<void>;
  onAvbryt: () => void;
}

export function HenleggBehandlingModal({ modalRef, henlegger, onHenlegg, onAvbryt }: Props) {
  const lukkModal = () => modalRef.current?.close();

  return (
    <Modal ref={modalRef} header={{ heading: "Henlegg behandling" }}>
      <Modal.Body>
        <BodyLong>
          Dette vil henlegge behandlingen og sette den som ferdigstilt. Behandlingen kan ikke
          gjenåpnes etter henleggelse. Er du sikker på at du vil henlegge behandlingen?
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap="space-4" justify="end">
          <Button
            variant="danger"
            onClick={async () => {
              await onHenlegg();
            }}
            loading={henlegger}
          >
            Henlegg
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onAvbryt();
              lukkModal();
            }}
            disabled={henlegger}
          >
            Avbryt
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal>
  );
}
