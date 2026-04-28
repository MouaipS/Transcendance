import {FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from '../../server/prisma.js'

export async function allFriendsRoute(request: FastifyRequest, reply: FastifyReply){
    const {id : userId} = request.user as {id: string; username:string}
    const rows = await prisma.friendship.findMany({
      where: {
        OR: [
            { request_id: userId},
            { received_id: userId},
        ],
      },
      include: {
        requester: {
            select: {
                id: true,
                username: true,
            },
        },
        receiver: {
            select: {
                id: true,
                username: true,
            },
        },
      },
    })

    const friends:      any[] = []
    const received_request: any[] = []
    const sent_request: any[]=[]

    for(const obj of rows){
        const isRequester = obj.request_id === userId
		const other = isRequester ? obj.receiver : obj.requester

		const obj_front = {
			friendship_id: 	obj.id,
			user_id:		other.id,
			username:		other.username,
		}

		if (obj.status === 'ACCEPTED') {
			friends.push(obj_front)
		} else if (obj.status === 'WAITING') {
			if(isRequester)
				sent_request.push(obj_front)
			else
				received_request.push(obj_front)
		}
	}
	return reply.status(200).send({ friends, received_request, sent_request })
}
