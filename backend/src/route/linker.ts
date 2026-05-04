import Fastify, { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify' //This imports the Fastify object types we need, its only for variable types
import {loginRoute} from "../route/authentication/login.js" //this the import for loginRoute function that is in the login.js
import {registerRoute} from "../route/authentication/register.js"//same but for the register route. NOTE : the path start from the main which is index.ts
import {logoutRoute} from "../route/authentication/logout.js"
import {refreshRoute} from "../route/authentication/refresh.js"
import {homePageRoute} from "../route/pages/homePage.js"
import { joinGameRoute , createGameRoute } from './game/lobby.js'


//This linker function takes the server as parameter which is a FastifyInstance type (our server)
export async function linker(server: FastifyInstance)
{
	
	const authenticate = async (request: FastifyRequest, reply: FastifyReply) => { //authenticate token function that is called at on request hook

		try {
    		// Get token from Cookies, if no token -> throw
        	// const accessToken = request.cookies.accessToken;
			console.log("Cookies bruts:", request.cookies); 
			console.log("Cookie accessToken:", request.cookies.accessToken)
        	// if (!accessToken) return reply.code(401).send({ message: "Missing token" });
        
        	// Check if Token incorrect / modified -> throw
        	const decoded = await request.jwtVerify()
        	request.user = decoded;
			console.log("Token decoded")

    	} catch (err: any) {

			console.log("error content: ", err)
			// if (err.name === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
				
			// 	console.log("authenticate error token")
            // 	return reply.code(401).send({ 
            //     	error: "Token expired", 
            //     	code: "TOKEN_EXPIRED" 
            // 	});
        	// }
			console.log("authenticate error any")
			return reply.code(403).header('WWW-Authenticate', 'Bearer').send();
		}
	};

	server.decorate("authenticate", authenticate);

	//these are the shorthand route declaration that execute the actual route
	server.post<{Body: any}>('/api/login', async (request, reply) => { return loginRoute(request, reply)}); 					//login route
	server.post<{Body: any}>('/api/register', async (request, reply) => { return registerRoute(request, reply)}); 				// registration route
	server.post('/api/refresh/logout', async (request, reply) => { return logoutRoute(request, reply)});
	server.post('/api/refresh', async (request, reply) => { return refreshRoute(request, reply)}); 									// logout route
	server.get('/api/home', {onRequest : [authenticate]}, async (request, reply) => { return homePageRoute(request, reply)});	// homePage display route
	server.post<{Body:any}>('/api/game/join', async (request, reply) => { return joinGameRoute(request, reply)});								// public random game route
	server.post<{Body:any}>('/api/game/create', async (request, reply) => { return createGameRoute(request, reply)});			// private game creation route
}
