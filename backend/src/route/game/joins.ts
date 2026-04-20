import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import {GameStatus} from '../../../generated/prisma/client.js'

export async function joinRoute(request : FastifyRequest, reply : FastifyReply)
{
    const games = await prisma.game.findMany({
		where: {
			status: GameStatus.WAITING,
		},
        orderBy: {
            nb_players: "asc"
        }
	});
    console.log("games", games);
	return reply.status(200).send(games);
}