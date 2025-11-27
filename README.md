# Gjenlevende BS Sak

Saksbehandlingsløsning for gjenlevende barnetilsyn og skolepenger

## Kom i gang

### 1. Installasjon

Installering av avhengigheter:

```bash
npm ci
```

### 2. Hent og sett miljøvariabler

Scriptet henter nødvendige hemmeligheter fra Kubernetes og oppretter en lokal `.env`-fil.

**NB:** Du må være pålogget Naisdevice.

```bash
sh hent-og-lagre-miljovariabler.sh
```

### 3. Start utviklingsserver

Start lokal utviklingsserver med hot module replacement:

```bash
npm run dev
```

Applikasjonen er tilgjengelig på http://localhost:8080/
