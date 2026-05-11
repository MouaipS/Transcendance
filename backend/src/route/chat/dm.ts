import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../../server/prisma.js'

//Pour typer les params de l'URL
interface HistoryParams { friendId : string}


// GET /api/chat/:friendId 
//Renvoie l'historique des messages entre un user auth et un ami
//marque tout les messages reçus comme lus
export async function dmHistoryRoute(
	request: FastifyRequest<{Params: HistoryParams}>,
	reply: FastifyReply
) {
	const { id: userId } = request.user as { id: string }
	const { friendId } = request.params

	//verification que l'état d'amitié est ACCEPTED
	//relation asymetrique donc OR
	//Si pas amis => 403 
	const friendship = await prisma.friendship.findFirst ({
		where: {
			status: 'ACCEPTED',
			OR :[
				{request_id : userId, received_id: friendId},
				{request_id : friendId, received_id: userId},
			],
		},
	})
	if(!friendship) return reply.code(403).send({error : 'Not Friends'})

	//recuperation de tout les messages sous forme de tableau
	const messages = await prisma.message.findMany({
		where: {
			OR: [
				{sender_id : userId, receiver_id: friendId},
				{sender_id : friendId, receiver_id: userId},
			],
		},
		orderBy: {created_at: 'asc'},
		take: 100,
	})

	//update tout les messages en lus
	await prisma.message.updateMany({
		where: {
			sender_id : friendId,
			receiver_id : userId,
			is_read: false,
		},
		data : {is_read: true},
	})
	//renvoie le tableau de messages dans un wrappeur
	return reply.code(200).send({messages})
}