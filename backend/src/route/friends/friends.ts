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

///////////////////////////////////////////////////////////////////////
interface CreateFriendshipBody{
    username: string
}

export async function createFriendshipRoute(request: FastifyRequest<{Body: CreateFriendshipBody}>, reply: FastifyReply) {
    const {id : userId, username: name} = request.user as {id: string; username:string}
    const { username: targetUsername } = request.body
    
    if (!targetUsername || typeof targetUsername !== 'string')
        return reply.code(400).send({error: "Username required"})
    if(name === targetUsername)
        return reply.code(400).send({error: "Cannot be your own username"})

    const target = await prisma.user.findUnique({
        where:{
            username: targetUsername
        },
        select:{
            id: true
        }
    })
    if(!target)
        return reply.code(404).send({error: "User not found"})

    const existing_friendship = await prisma.friendship.findFirst({
        where: {
            OR: [
                {request_id: userId, received_id: target.id},
                {request_id: target.id, received_id: userId}
            ],
        },
    })

    if (existing_friendship) {
        if(existing_friendship.status === 'ACCEPTED') {
            return reply.code(409).send({error: 'Already friends'})
        } else if (existing_friendship.status === 'WAITING') {
            if (existing_friendship.received_id === userId) {
                const update = await prisma.friendship.update({
                    where: {
                        id: existing_friendship.id },
                    data: {
                        status: 'ACCEPTED' }
                })
                return reply.code(200).send({
                    message: "Mutual request, noow friends",
                    friendship: update,
                })
            }
            return reply.code(409).send({error: "Friend request already sent"})
        }
    }

    const friendship = await prisma.friendship.create({
        data:{
            request_id: userId,
            received_id: target.id,
            status: 'WAITING',
        }
    })
    return reply.code(201).send({
        message: "Friend request send",
        friendship:friendship,
    })
}


///////////////////////////////////////////////////////////////

interface AcceptFriendshipParams {
    id: string
}

export async function AcceptFriendshipRoute(request: FastifyRequest<{ Params: AcceptFriendshipParams}>, reply: FastifyReply){
    const {id : userId} = request.user as {id: string; username:string}
    const friendshipId = parseInt(request.params.id, 10)

    if (isNaN(friendshipId)) 
        return reply.code(400).send({error: "Invalid friendship id"})

    const friendship = await prisma.friendship.findUnique({
        where: {
            id: friendshipId
        }
    })
    if (!friendship) {
        return reply.code(404).send({error: "friend request not found"})
    }
    if(friendship.received_id !== userId) {
        return reply.code(403).send({error: "Not authorized"})
    }
    if(friendship.status !== 'WAITING') {
        return  reply.code(409).send({error: "request not wainting"})
    }

    const updated = await prisma.friendship.update({
        where: {
            id: friendshipId
        },
        data: {
            status: 'ACCEPTED'
        },
    })
    return reply.code(200).send({
        message: "friend request accepted",
        friendship: updated,
    })





}