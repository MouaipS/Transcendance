#!/bin/sh

set -e #pour recup toutes les erreurs

#TODO Retirer les commentaires en fr
# -Pour verifier que Vault demarre bien avant de pouvoir utiliser le back : petit ping"
    until curl "${VAULT_ADDR}/v1/sys/health" > /dev/null; do
        sleep 1
    done

#je remplis le Vault avec les informations d'auth puis de la db
#en 2 partie pour avoir une sorte d'historique des "commits"
curl -sf -X POST \
    -H "X-Vault-Token: ${VAULT_TOKEN}"\
    -H "Content-type: application/json" \
    -d "{\"data\": {\"pepper\": \"$PEPPER\", \"jwt_secret\": \"$JWT_SECRET\"}}" \
    "${VAULT_ADDR}/v1/secret/data/auth" > /dev/null

curl -sf \
  -X POST \
  -H "X-Vault-Token: $VAULT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"data\": {\"db_user\": \"$POSTGRES_USER\", \"db_password\": \"$POSTGRES_PASSWORD\", \"db_name\": \"$POSTGRES_DB\"}}" \
  "$VAULT_ADDR/v1/secret/data/database" > /dev/null

#j'essaye de me connecter â la db pour voir si elle est up si non wait
#la boucle s'arrete avec un exit code 0
until node -e "
    const net = require('node:net');
    const socket = new net.Socket();
    socket.connect(5432, 'db');
    socket.on('connect', function() {
        socket.destroy();
        process.exit(0);
    
    });
    socket.on('error', function() {
        socket.destroy();
        process.exit(1);
    });
" 2>/dev/null; do 
    sleep 1
done

#on demande à Vault de donner les infos au back
#on va recuperer la table  
DB_INFO=$(curl -sf \
    -H "X-Vault-Token: ${VAULT_TOKEN}" \
    "$VAULT_ADDR/v1/secret/data/database")


#on parse le json pour extraire les 3 données essentiel pour l'adresse de la db
    #on recup tout le JSON
    #on prend juste la partie data 
    #on recup les elements un par un et on les affiches dans la sortie standard de node
    #eval va recup tout ça et l'exec pour finalement obtenir les variables d'env
eval $(echo "$DB_INFO" | node -e "
    let content = '';
    process.stdin.on('data', bloc => {
        content += bloc;    
    });

    process.stdin.on('end', () => {
        let db_bloc = JSON.parse(content).data.data;
        console.log('DB_USER=' + db_bloc.db_user);
        console.log('DB_PASSWORD=' + db_bloc.db_password);
        console.log('DB_NAME=' + db_bloc.db_name);
    });
")

export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}?schema=public"

npx prisma migrate deploy

exec node server.js