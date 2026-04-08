import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'

export async function registerRoute(request : FastifyRequest, reply : FastifyReply) 
{
	//server.post('/api/register', async(request, reply) => {
	console.log("headers register", request.headers);
	console.log("body register", request.body);
	console.log("url register", request.url);
	return;
}
