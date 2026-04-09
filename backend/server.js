import Fastify 			from 'fastify'
import { PrismaClient } from '@prisma/client'
import bcrypt			from 'bcrypt'


/**
 * @brief demande au vault les variables au vault
 * @param auth (info pour l'authentification des users) et database (pour la db)
 * @returns un json avec les infos
 */
async function fetchVault(path) {
	const response = await fetch(`${VAULT_ADDR}/v1/secret/data/path`, {
		headers: {
			"X-Vault-Token": VAULT_TOKEN
		}
	});
	if (response.ok === false)
		throw new Error("Vault information is unavailable");
	const json = await response.json();
	return json.data.data;
}


const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
	return {status: 'ok'};
});

fastify.listen({ port: 3001, host: '0.0.0.0' }, (err) =>{
	if (err) {
		fastify.log.error(err);
		// ProcessingInstruction.exit(1);
		ProcessingInstruction.exit(1);
	}
});
