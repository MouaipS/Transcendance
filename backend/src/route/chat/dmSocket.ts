import { FastifyRequest } from 'fastify'
import {WebSocket } from '@fastify/websocket'
import { prisma } from '../../server/prisma.js'

const dmConnections = new Map<string, WebSocket>()

interface DMPayload {
	type: 'DM'
	to: string				//user_id
	content: string
}

export async function dmSocketRoute(websocket: WebSocket, request: FastifyRequest) {

	const {id: userId, username } = request.user as { id: string; username: string}

	const previous = dmConnections.get(userId)
	if(previous && previous.readyState === previous.OPEN) {
		previous.close(4000, 'Replaced by new connection')
	}
	dmConnections.set(userId, websocket)

	websocket.on('message', async (raw: any) => {
		let message: DMPayload
		try {
			message = JSON.parse(raw.toString())
		} catch {return}
		if (message.type !== 'DM') return
		if (typeof message.to !== 'string' || typeof message.content !== 'string') return
		const content = message.content.trim()
		if(!content || content.length > 1000) return
		if (message.to === userId) return

		const friendship = await prisma.friendship.findFirst({
			where: {
				status: 'ACCEPTED',
				OR: [
					{request_id: userId, received_id: message.to},
					{request_id: message.to, received_id: userId},
				],
			},
		})
		if(!friendship) {
			websocket.send(JSON.stringify({ type : 'ERROR', error: 'Not friends'}))
			return
		}

		const stored = await prisma.message.create({
			data: {
				sender_id: userId,
				receiver_id: message.to,
				content,
			},
		})

		const payload = JSON.stringify({
			type: 'DM',
			id: stored.id,
			sender_id:userId,
			sender_username: username,
			receiver_id: message.to,
			content: stored.content,
			created_at :stored.created_at.toISOString(),
		})

		websocket.send(payload)

		const receiverSocket = dmConnections.get(message.to)
		if(receiverSocket && receiverSocket.readyState === receiverSocket.OPEN) {
			receiverSocket.send(payload)
		}
	})

	websocket.on('close', () => {
		if(dmConnections.get(userId) === websocket) {
			dmConnections.delete(userId)
		}
	})
}