import Fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify' //This imports the Fastify object types we need, its only for variable types
import {loginRoute} from "../route/authentication/login.js" //this the import for loginRoute function that is in the login.js
import {registerRoute} from "../route/authentication/register.js"//same but for the register route. NOTE : the path start from the main which is index.ts

//This linker function takes the server as parameter which is a FastifyInstance type (our server)
export async function linker(server: FastifyInstance)
{
	server.post('/api/login', async(request, reply) => { loginRoute(request, reply);}) //these are the shorthand route declaration that execute the actual route
	server.post('/api/register', async(request, reply) => { registerRoute(request, reply);})
}
