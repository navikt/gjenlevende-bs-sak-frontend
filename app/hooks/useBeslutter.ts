import { useState } from "react";
import { apiCall, type ApiResponse } from "~/api/backend";

export const useBeslutter = () => {
  const [sender, settSender] = useState(false);

  const kallBeslutterEndepunkt = async (
    endpoint: string,
    behandlingId: string
  ): Promise<ApiResponse<unknown>> => {
    settSender(true);
    try {
      return await apiCall(`/beslutter/${endpoint}/${behandlingId}`, {
        method: "POST",
      });
    } finally {
      settSender(false);
    }
  };

  const sendTilBeslutter = (behandlingId: string) =>
    kallBeslutterEndepunkt("send-til-beslutter", behandlingId);

  const angreSendTilBeslutter = (behandlingId: string) =>
    kallBeslutterEndepunkt("angre-send-til-beslutter", behandlingId);

  return {
    sender,
    sendTilBeslutter,
    angreSendTilBeslutter,
  };
};
