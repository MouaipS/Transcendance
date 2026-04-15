import Fastify, { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify' //This imports the Fastify object types we need, its only for variable types
import {loginRoute} from "../route/authentication/login.js" //this the import for loginRoute function that is in the login.js
import {registerRoute} from "../route/authentication/register.js"//same but for the register route. NOTE : the path start from the main which is index.ts
import {homePageRoute} from "../route/pages/homePage.js"

//This linker function takes the server as parameter which is a FastifyInstance type (our server)
export async function linker(server: FastifyInstance)
{
	//server.post('/api/login', async(request, reply) => { loginRoute(request, reply);}) //these are the shorthand route declaration that execute the actual route
	server.post<{Body: any}>('/api/login', async (request, reply) => { return loginRoute(request, reply)});
	server.post<{Body: any}>('/api/register', async (request, reply) => { return registerRoute(request, reply)});
	server.get('/api/home', async (request, reply) => { return homePageRoute(request, reply)});
}

//REQUETES TEST 

// REGISTER :
// curl -X POST http://localhost:3000/api/register \
//      -H "Content-Type: application/json" \
//      -d '{"username": "testuser", "password": "mypassword123"}'

// LOGIN :
// curl -X POST http://localhost:3000/api/login \
//      -H "Content-Type: application/json" \
//      -d '{"username": "testuser", "password": "mypassword123"}'
