import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import {linker} from "../route/linker.js"
import { prisma } from "./prisma.js"
import {GameStatus} from '../../generated/prisma/client.js'
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from "@fastify/jwt"

const server = fastify();

server.register(fastifyJwt, {secret : 'LeTeckelApoilDurEstUnFoutuClebard'})
server.register(fastifyCookie, {secret: "AutmanMeRegardeFixement"})
linker(server);

//Creation of an empty public game
prisma.game.create({
	data: {
		status: GameStatus.WAITING,
	}
});

server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => 
{
  if (err) 
	{
		console.error(err)
		process.exit(1)
  	}
  console.log(`Server listening at ${address}`)
})
