import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

export async function avatarRoute(request : FastifyRequest, reply : FastifyReply)
{
	const user = request.user as { id: string }

	const dbUser = await prisma.user.findUnique(
	{
    	where: { id: user.id },
    	select: { avatarUrl: true },
  	})

	if (!dbUser) 
	{
		return reply.code(404).send({ message: 'User not found' })
	}
	return reply.send({ avatarUrl: dbUser.avatarUrl })
}
