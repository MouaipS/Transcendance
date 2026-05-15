import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

export async function avatarRoute(request : FastifyRequest, reply : FastifyReply)
{
	console.log("la avatar route");
	const user = request.user as { username: string }

	const dbUser = await prisma.user.findUnique(
	{
    	where: { username: user.username },
    	select: { avatarUrl: true },
  	})

	if (!dbUser) 
	{
		return reply.code(404).send({ message: 'User not found' })
	}
	console.log(dbUser.avatarUrl);
	return reply.send({ avatarUrl: dbUser.avatarUrl })
}
