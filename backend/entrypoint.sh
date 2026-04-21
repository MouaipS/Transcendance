#!/bin/sh
set -e

until curl -sf "$VAULT_ADDR/v1/sys/health" >/dev/null; do
	sleep 1
done

echo "Le Vault est ok\n"

until node -e "
	const net = require('node:net');
	const socket = new net.Socket();
	socket.connect(5432, 'db');
	socket.on('connect', function(){
		socket.destroy();
		process.exit(0);
	});
	socket.on('error', function(){
		socket.destroy();
		process.exit(1);
	});
" 2>/dev/null; do
	sleep 1
done


DB_INFO=$(curl -sf \
	-H "X-Vault-Token: ${VAULT_TOKEN}" \
	"$VAULT_ADDR/v1/secret/data/database")

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

npx prisma migrate dev --name init
npx prisma generate
npm run build

exec npm start