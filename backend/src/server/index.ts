import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import {linker} from "../route/linker.js"
import { prisma } from "./prisma.js"
import fastifyJwt from "@fastify/jwt"

const server = fastify();

server.register(fastifyJwt, {secret : 'LeTeckelApoilDurEstUnFoutuClebard'})
linker(server);


server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => 
{
  if (err) 
	{
		console.error(err)
		process.exit(1)
  	}
  console.log(`Server listening at ${address}`)
})
