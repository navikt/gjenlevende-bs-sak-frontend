import { useEffect, useState } from "react";
import {apiCall, type ApiResponse, type Barn} from "~/api/backend";

interface HentBarnState {
    barn: Barn[];
    melding: string | null;
    laster: boolean;
}

export function useHentBarn(personIdent: string | undefined) {
    const [state, settState] = useState<HentBarnState>({
        barn: [],
        melding: null,
        laster: true,
    });

    useEffect(() => {
        const hentBarnFraPdl = async (personIdent: string): Promise<ApiResponse<Barn[]>> => {
            return apiCall(`/pdl/barn`, {
                method: "POST",
                body: JSON.stringify({ personIdent }),
            });
        };

        let avbrutt = false;

        const hentBarn = async () => {
            if (avbrutt) return;

            if (!personIdent) {
                settState((prev) => ({
                    ...prev,
                    barn: [],
                    melding: null,
                    laster: false,
                }));
                return;
            }

            settState((prev) => ({ ...prev, melding: null, laster: true }));

            const response = await hentBarnFraPdl(personIdent);

            if (avbrutt) return;

            if (response.data) {
                settState((prev) => ({
                    ...prev,
                    barn: response.data ?? [],
                    laster: false,
                }));
            } else {
                settState((prev) => ({
                    ...prev,
                    barn: [],
                    melding: response.melding ?? "Kunne ikke hente barn",
                    laster: false,
                }));
            }
        };

        hentBarn();

        return () => {
            avbrutt = true;
        };
    }, [personIdent]);

    return state;
}
