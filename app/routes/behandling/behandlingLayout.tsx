import React from "react";
import { Outlet, useParams } from "react-router";
import { BehandlingContext } from "~/contexts/BehandlingContext";

export default function BehandlingLayout() {
  const { behandlingId } = useParams<{ behandlingId: string }>();
  //   const { behandling } = useHentBehandling(behandlingId);

  if (!behandlingId) {
    return <div>Mangler behandling id</div>;
  }

  return (
    <BehandlingContext.Provider value={{ behandlingId }}>
      <Outlet />
    </BehandlingContext.Provider>
  );
}
