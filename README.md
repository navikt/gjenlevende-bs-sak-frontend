# Gjenlevende BS Sak

Saksbehandlingsløsning for gjenlevende barnetilsyn og skolepenger

## Kom i gang

### 1. Installasjon

Installering av avhengigheter:

```bash
npm ci
```

#### Installering av @navikt pakker

For å kunne installere private @navikt-pakker fra GitHub Package Registry trenger du et Personal Access Token (PAT).

1. **Opprett et Personal Access Token:**
   - Gå til [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)]
   - Gi tokenet `read:packages` scope
   - Kopier tokenet

2. **Logg inn med npm:**

   ```bash
   npm login --scope=@navikt --registry=https://npm.pkg.github.com
   ```

   - **Username:** Ditt GitHub brukernavn
   - **Password:** Personal Access Token (PAT) som du genererte

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
