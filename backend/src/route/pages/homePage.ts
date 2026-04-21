import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

export async function homePageRoute(request : FastifyRequest, reply : FastifyReply) 
{
    const {username} = request.query as {username: string}; ///home?username=login
	const stats = await prisma.user.findUnique({
		where: {
			username: username,
		},
        select: {
            stats: {
                select: {
                    nb_games: true,
                    nb_victories: true,
                    nb_defeats: true,
                }
            }
        }
	});
    console.log("stats", stats);
	return reply.status(200).send(stats);
}