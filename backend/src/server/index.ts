import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import {linker} from "../route/linker.js"
import { prisma } from "./prisma.js"
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from "@fastify/jwt"
import { getAuthSecrets } from './vault.js';

async function bootstrap(){
	const {jwt, cookie } = await getAuthSecrets();

	const server = fastify();

	await server.register(fastifyJwt, {secret : jwt});
	await server.register(fastifyCookie, {secret: cookie});
	linker(server);

	try {
		const address = await server.listen({ port: 3001, host: '0.0.0.0' });
		console.log(`Server listening at ${address}.`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	} 
}

bootstrap().catch((err) => {
	console.error("Bootstrap failed - error :", err);
	process.exit(1);
})