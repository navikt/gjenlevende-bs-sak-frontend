export enum BehandlingResultat {
    INNVILGE = 'INNVILGE',
    INNVILGE_UTEN_UTBETALING = 'INNVILGE_UTEN_UTBETALING',
    SANKSJONERE = 'SANKSJONERE',
    AVSLÅ = 'AVSLÅ',
    HENLEGGE = 'HENLEGGE',
    OPPHØRT = 'OPPHØRT',
}

export enum ResultatType {
    INNVILGET = 'INNVILGET',
    AVSLÅTT = 'AVSLÅTT',
    HENLAGT = 'HENLAGT',
    OPPHØR = 'OPPHØR',
}

export enum Periodetype {
    ORDINÆR = 'ORDINÆR',
    INGEN_STØNAD = 'INGEN_STØNAD'
}

export enum AktivitetstypeBarnetilsyn {
    I_ARBEID = 'I_ARBEID',
    FORBIGÅENDE_SYKDOM = 'FORBIGÅENDE_SYKDOM',
}

export interface Vedtak {
    resultatType: ResultatType;
    begrunnelse?: string;
    barnetilsynperioder: Barnetilsynperiode[];
    saksbehandlerIdent?: string;
    opphørFom?: string;
    beslutterIdent?: string;
    opprettetTid?: string;
    opprettetAv?: string;
}

export interface Barnetilsynperiode {
    behandlingId: string;
    datoFra: string;
    datoTil: string;
    utgifter: number;
    barn: string[];
    periodetype: Periodetype | undefined;
    aktivitetstype: AktivitetstypeBarnetilsyn | undefined;
}

export interface BarnetilsynBeregningRequest {
    barnetilsynBeregning: Barnetilsynberegning[]
}

export interface Barnetilsynberegning {
    datoFra: string;
    datoTil: string;
    utgifter: number;
    barn: string[];
    periodetype: Periodetype;
}

export type Beløpsperioder = {
    datoFra: string;
    datoTil: string;
    utgifter: number;
    antallBarn: number;
    beløp: number;
    periodetype: Periodetype;
}[];
