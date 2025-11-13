#!/bin/bash

kubectl config use-context dev-gcp
kubectl config set-context --current --namespace=etterlatte

function get_secrets() {
  local repo=$1
  kubectl -n etterlatte get secret ${repo} -o json | jq '.data | map_values(@base64d)'
}

GJENLEVENDE_BS_SAK_FRONTEND_LOKAL_SECRETS=$(get_secrets azuread-gjenlevende-bs-sak-frontend-lokal)

GJENLEVENDE_BS_SAK_FRONTEND_CLIENT_ID=$(echo "$GJENLEVENDE_BS_SAK_FRONTEND_LOKAL_SECRETS" | jq -r '.AZURE_APP_CLIENT_ID')
GJENLEVENDE_BS_SAK_FRONTEND_CLIENT_SECRET=$(echo "$GJENLEVENDE_BS_SAK_FRONTEND_LOKAL_SECRETS" | jq -r '.AZURE_APP_CLIENT_SECRET')

# Generate random 32 character strings for the cookie and session keys
SESSION_SECRET=$(openssl rand -hex 16)

if [ -z "$GJENLEVENDE_BS_SAK_FRONTEND_CLIENT_ID" ]
then
      echo "Klarte ikke å hente miljøvariabler. Er du pålogget Naisdevice og google?"
      return 1
fi

# Write the variables into the .env file
cat << EOF > .env
# Denne filen er generert automatisk ved å kjøre \`hent-og-lagre-miljovariabler.sh\`

SESSION_SECRET='$SESSION_SECRET'

CLIENT_ID='$GJENLEVENDE_BS_SAK_FRONTEND_CLIENT_ID'
CLIENT_SECRET='$GJENLEVENDE_BS_SAK_FRONTEND_CLIENT_SECRET'

# Lokalt
#ENV=local
#GJENLEVENDE_BS_SAK_SCOPE=api://dev-gcp.etterlatte.gjenlevende-bs-sak-lokal/.default

# Lokalt mot preprod
ENV=lokalt-mot-preprod
GJENLEVENDE_BS_SAK_SCOPE=api://dev-gcp.etterlatte.gjenlevende-bs-sak/.default

APP_VERSION=0.0.1
EOF

echo ".env-fil er opprettet med miljøvariabler fra dev-gcp"
