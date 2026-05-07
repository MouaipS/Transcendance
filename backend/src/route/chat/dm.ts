import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../../server/prisma.js'

interface HistoryParams { friendId : string}


export async function dmHistoryRoute(
	request: FastifyRequest<{Params: HistoryParams}>,
	reply: FastifyReply
) {
	const { id: userId } = request.user as { id: string }
	const { friendId } = request.params

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

	await prisma.message.updateMany({
		where: {
			sender_id : friendId,
			receiver_id : userId,
			is_read: false,
		},
		data : {is_read: true},
	})
	return reply.code(200).send({messages})
}