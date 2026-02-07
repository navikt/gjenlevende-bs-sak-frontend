import { Button, HStack, Modal, VStack } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
import { BrevmottakereListe } from "~/komponenter/brev/BrevmottakereListe";
import { type Brevmottaker } from "~/hooks/useBrevmottaker";
import { ManueltSøk } from "~/komponenter/brev/ManueltSøk";
import { Skillelinje } from "~/komponenter/layout/Skillelinje";
import { SkalBrukerMottaBrev } from "~/komponenter/brev/SkalBrukerMottaBrev";
import { useBehandlingContext } from "~/contexts/BehandlingContext";

interface Props {
  mottakere: Brevmottaker[];
  settMottakere: (mottakere: Brevmottaker[]) => void;
  lukkModal: () => void;
  sendMottakereTilSak: (behandlingId: string, mottakere: Brevmottaker[]) => void;
}

export default function BrevmottakerModalInnhold({
  mottakere,
  settMottakere,
  lukkModal,
  sendMottakereTilSak,
}: Props) {
  const [midlertidigMottakerliste, settMidlertidigMottakerliste] = useState<Brevmottaker[]>([]);
  const { behandlingId } = useBehandlingContext();

  useEffect(() => {
    settMidlertidigMottakerliste([...mottakere]);
  }, [mottakere]);

  const leggTilMottaker = (mottaker: Brevmottaker) => {
    settMidlertidigMottakerliste((prev) => [...prev, mottaker]);
  };

  const fjernMottaker = (index: number) => {
    settMidlertidigMottakerliste((prev) => prev.filter((_, i) => i !== index));
  };

  const håndterSettMottakere = () => {
    settMottakere(midlertidigMottakerliste);
    sendMottakereTilSak(behandlingId, midlertidigMottakerliste);

    lukkModal();
  };

  const håndterAvbryt = () => {
    settMidlertidigMottakerliste([...mottakere]);
    lukkModal();
  };

  const harEndringer = JSON.stringify(mottakere) !== JSON.stringify(midlertidigMottakerliste);

  return (
    <>
      <Modal.Body style={{ height: "100%" }}>
        <HStack gap={"4"} justify={"space-evenly"}>
          <VStack gap={"4"} width={"47%"}>
            <ManueltSøk leggTilMottaker={leggTilMottaker} />
            <Skillelinje />
            <SkalBrukerMottaBrev
              mottakere={midlertidigMottakerliste}
              leggTilMottaker={leggTilMottaker}
              fjernMottaker={fjernMottaker}
            />
          </VStack>
          <Skillelinje />
          <VStack width={"47%"}>
            <BrevmottakereListe
              mottakere={midlertidigMottakerliste}
              fjernMottaker={fjernMottaker}
            />
          </VStack>
        </HStack>
      </Modal.Body>
      <Modal.Footer>
        <HStack gap={"2"} justify={"center"} style={{ marginTop: "1rem" }}>
          <Button variant={"secondary"} onClick={håndterAvbryt}>
            Avbryt
          </Button>
          <Button onClick={håndterSettMottakere} disabled={!harEndringer}>
            Sett mottakere
          </Button>
        </HStack>
      </Modal.Footer>
    </>
  );
}
