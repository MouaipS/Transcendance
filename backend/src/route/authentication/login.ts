import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"


export async function loginRoute(request : FastifyRequest, reply : FastifyReply)
{
	const {username, password} = request.body as any;
	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
	});

	if (!user || user.password !== password)
	{
		console.log("Invalid Login")
		return reply.code(401).send({
			error: "Invalid login"
		})
	}
	else
	{
		console.log("Connexion Succeeded")
		return reply.code(200).send({
			message: "Connexion suceeded",
			user: { id: user.id, username: user.username }
		})
	}
	
	// console.log("headers login", request.headers);
	// console.log("body login", request.body);
	// console.log("url login", request.url);
	return
}
