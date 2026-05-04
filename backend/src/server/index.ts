import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import websocket from '@fastify/websocket'
import {linker} from "../route/linker.js"
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from "@fastify/jwt"

const server = fastify();

server.register(fastifyJwt, {secret : 'LeTeckelApoilDurEstUnFoutuClebard'})
server.register(fastifyCookie, {secret: "AutmanMeRegardeFixement"})

//Websocket : clientTracking protocol active to keep the socket connected,
// --> periodic ping-pong between client and server
server.register(websocket, {
	options: {
		clientTracking: true,
		pingInterval: 30000,
		pongTimeout: 10000,
	},
})

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
