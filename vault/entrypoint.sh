#!/bin/sh
set -e

#Pour installer jq (parser json) si il existe pas encore
command -v jq >/dev/null 2>&1 || apk add --no-cache jq

#Pour indiquer l'emplacement du root token et unseal keys
INIT_FILE="/vault/init/keys.json"


#demarrer le vault avec notre fichier de configuration en arriere plan
vault server -config=/vault/config.hcl &
#Sauvegarde du processus
VAULT_PID=$!

#Addresse pour contacter le server
export VAULT_ADDR="https://127.0.0.1:8200"
#dit quel certif faire confiance pour valider la connexion TLS sinon refus du self-signed.
export VAULT_CACERT="/vault/tls/vault.crt"

#on cherche à savoir si le server est up, on cherche le Initialized
# si on check juste le status, un vault sealed renvoie 2, Initialized renvoie true or false
until vault status 2>/dev/null | grep -q "Initialized"; do
    sleep 1
done

#Si pas de root token et unseal keys
if [ ! -f "$INIT_FILE" ]; then
    echo "Vault: premier boot"
	#genere un root token| sortie en json | 5 unseals keys | configure pour 3keys minimum pour unseal
    vault operator init -format=json -key-shares=5 -key-threshold=3 > "$INIT_FILE"
	#on change les droits, pour etre en accord avec la strict policy du projet
    chmod 644 "$INIT_FILE"
    FIRST_BOOT=1
else
    echo "Vault: pas le premier boot => pas de reinit"
    FIRST_BOOT=0
fi


#Unseal avec les 3 premières clés 
#Utilisation de jq qui est un parser pour json
for i in 0 1 2; do
	# -r pour retirer les quotes,  on va chercher dans le tableau unseal... la valeur des clefs
    KEY=$(jq -r ".unseal_keys_b64[$i]" "$INIT_FILE")
    vault operator unseal "$KEY" >/dev/null
done

#parsing du root token
ROOT_TOKEN=$(jq -r '.root_token' "$INIT_FILE")
vault login "$ROOT_TOKEN" >/dev/null

if [ "$FIRST_BOOT" = "1" ]; then

    vault secrets enable -path=secret kv-v2 || true

    vault kv put secret/auth \
        pepper="$PEPPER" \
        jwt="$JWT_SECRET" \
        cookie="$COOKIE_SECRET"

    vault kv put secret/database \
        db_user="$POSTGRES_USER" \
        db_password="$POSTGRES_PASSWORD" \
        db_name="$POSTGRES_DB"

    echo "Vault secrets seedés"
fi

echo "Vault ok et unsealed"

wait $VAULT_PID