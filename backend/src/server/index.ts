/// <reference types="node" />
import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import websocket from '@fastify/websocket'
import {linker} from "../route/linker.js"
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from "@fastify/jwt"
import "dotenv/config"

const server = fastify();

//Websocket : clientTracking protocol active to keep the socket connected,
// --> periodic ping-pong between client and server
server.register(websocket, {
	options: {
		clientTracking: true,
		pingInterval: 30000,
		pongTimeout: 10000,
	},
})

const cookieSecret = process.env.COOKIE_SECRET!
const jwtSecret = process.env.JWT_SECRET!

if (!cookieSecret || !jwtSecret)
{
	console.log("COOKIE_SECRET or JWT_SECRET not defined")
	process.exit(1);
}

server.register(fastifyCookie)
server.register(fastifyJwt, {
	secret: jwtSecret,
	cookie: {
		cookieName: 'accessToken',
		signed: false
	}
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
