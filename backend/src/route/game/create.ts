import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import {GameStatus} from '../../../generated/prisma/client.js'

interface CreationBody {
  owner: string;
}

export async function gameCreationRoute(request : FastifyRequest<{Body: CreationBody}>, reply : FastifyReply)
{
    const {owner} = request.body
    const game = await prisma.game.create({
		data: {
		    status: GameStatus.WAITING,
            nb_players: 1,
            owner: owner
	    }
	});
	return reply.status(200).send(game);
}