import Fastify, { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify' //This imports the Fastify object types we need, its only for variable types
import {loginRoute} from "../route/authentication/login.js" //this the import for loginRoute function that is in the login.js
import {registerRoute} from "../route/authentication/register.js"//same but for the register route. NOTE : the path start from the main which is index.ts
import {logoutRoute} from "../route/authentication/logout.js"
import {homePageRoute} from "../route/pages/homePage.js"
import { joinGameRoute , createGameRoute } from './game/lobby.js'
import { webSocketRoute } from './game/start-game.js'


//This linker function takes the server as parameter which is a FastifyInstance type (our server)
export async function linker(server: FastifyInstance)
{
	
	const authenticate = async (request: FastifyRequest, reply: FastifyReply) => { //authenticate token function that is called at on request hook

		try {

    		// Get token from Cookies, if no token -> throw
        	const token = request.cookies.token;
        	if (!token) throw new Error("Missing token");
        
        	// Check if Token incorrect / modified -> throw
        	const decoded = await server.jwt.verify(token);
        	request.user = decoded;
			console.log("token decoded")
    	} catch (err) { reply.code(401).send({ error: "Authentification required" }) }
	};

	server.decorate("authenticate", authenticate);

	//HTTP routes
	server.post<{Body: any}>('/api/login', async (request, reply) => { return loginRoute(request, reply)}); 					//login route
	server.post<{Body: any}>('/api/register', async (request, reply) => { return registerRoute(request, reply)}); 				// registration route
	server.post('/api/logout', async (request, reply) => { return logoutRoute(reply)}); 										// logout route
	server.get('/api/home', {onRequest : [authenticate]}, async (request, reply) => { return homePageRoute(request, reply)});	// homePage display route
	
	//HTTP game routes
	server.post<{Body:any}>('/api/game/join', async (request, reply) => { return joinGameRoute(request, reply)});								// public random game route
	server.post<{Body:any}>('/api/game/create', async (request, reply) => { return createGameRoute(request, reply)});			// private game creation route

	//Websockets
	server.get('/ws/game/:code', {websocket: true}, webSocketRoute)
}

