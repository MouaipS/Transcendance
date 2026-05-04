import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

export async function homePageRoute(request : FastifyRequest, reply : FastifyReply) 
{
    console.log("homePageRoute - debut")
    const {username} = request.user as {username: string}
    const stats = await prisma.user.findUnique({
		where: {
			username: username,
		},
        select: {
            username: true,
            stats: {
                select: {
                    nb_games: true,
                    nb_victories: true,
                    nb_defeats: true,
                }
            }
        }
	});
    console.log("homePageRoute - fin")
	return reply.status(200).send(stats);
}