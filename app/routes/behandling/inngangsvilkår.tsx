import React from "react";
import { useBehandlingContext } from "~/contexts/BehandlingContext";

export default function Inngangsvilkår() {
  const { behandlingId } = useBehandlingContext();

  return <div>Inngangsvilkår side for behandling {behandlingId}</div>;
}
