export enum EBehandlingResultat {
    INNVILGE = 'INNVILGE',
    INNVILGE_UTEN_UTBETALING = 'INNVILGE_UTEN_UTBETALING',
    SANKSJONERE = 'SANKSJONERE',
    AVSLÅ = 'AVSLÅ',
    HENLEGGE = 'HENLEGGE',
    OPPHØRT = 'OPPHØRT',
}

export enum EResultatType {
    INNVILGET= 'INNVILGET',
    AVSLÅTT = 'AVSLÅTT',
    HENLAGT = 'HENLAGT',
    OPPHØR = 'OPPHØR',
}

export enum EPeriodetype {
    ORDINÆR = 'ORDINÆR',
    INGEN_STØNAD = 'INGEN_STØNAD'
}

export enum EAktivitetstypeBarnetilsyn {
    I_ARBEID = 'I_ARBEID',
    FORBIGÅENDE_SYKDOM ='FORBIGÅENDE_SYKDOM',
}

export interface IVedtak {
    resultatType: EResultatType;
    begrunnelse?: string;
    barnetilsynperioder: IBarnetilsynperiode[];
    saksbehandlerIdent?: string;
    opphørFom?: string;
    beslutterIdent?: string;
    opprettetTid?: string;
    opprettetAv?: string;
}

export interface IBarnetilsynperiode {
    behandlingId: string;
    datoFra: string;
    datoTil: string;
    utgifter: number;
    barn: string[];
    periodetype: EPeriodetype | undefined;
    aktivitetstype: EAktivitetstypeBarnetilsyn | undefined;
}

export interface BarnetilsynBeregningRequest {
    barnetilsynBeregning: IBarnetilsynberegning[]
}

export interface IBarnetilsynberegning {
    datoFra: string;
    datoTil: string;
    utgifter: number;
    barn: string[];
    periodetype: EPeriodetype;
}

export type BeløpsperioderDto = {
    datoFra: string;
    datoTil: string;
    utgifter: number;
    antallBarn: number;
    beløp: number;
    periodetype: EPeriodetype;
}[];
