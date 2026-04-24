import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

export async function homePageRoute(request : FastifyRequest, reply : FastifyReply) 
{
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
                    rank					: true,
	                rank_max				: true,
	                favorite_card			: true,
	                avg_reaction_ms			: true,
	                most_smashed_card		: true,
	                most_combo_smash		: true,
	                nb_smash				: true,
	                nb_smash_success		: true,
	                max_win_streak			: true,
	                max_loose_streak		: true,
	                max_smash_success_streak: true,
	                hours_played			: true,
	                nb_bonus_played			: true,
                }
            }
        }
	});
	return reply.status(200).send(stats);
}