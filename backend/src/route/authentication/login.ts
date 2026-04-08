import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'

export async function loginRoute(request : FastifyRequest, reply : FastifyReply)
{
	console.log("headers login", request.headers);
	console.log("body login", request.body);
	console.log("url login", request.url);
	return;
}
