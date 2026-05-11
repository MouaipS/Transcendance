import { FastifyRequest } from 'fastify'
import {WebSocket } from '@fastify/websocket'
import { prisma } from '../../server/prisma.js'

//liste des utilisateurs actuellements connectés au WebSocket du chat
const dmConnections = new Map<string, WebSocket>()

//interface du payload attendu du client
//on le definit pour le cast et type-check le Json.parse
interface DMPayload {
	type: 'DM'
	to: string				//user_id
	content: string
}

//Handler principal du WebSocket /ws/chat
//Appelé oar Fastify pour chaque nouvelle connexion
export async function dmSocketRoute(websocket: WebSocket, request: FastifyRequest) {

	//extrait l'identité du user
	const {id: userId, username } = request.user as { id: string; username: string}

	//Si user a deja un scoket actif (cas de double onglet ou reload), on le ferme avant de save le nouveau
	//Code 4000 : dans la plage 'application-defined closes codes' - c'est la valeur pour fermeteures volontaires
	const previous = dmConnections.get(userId)
	if(previous && previous.readyState === previous.OPEN) {
		previous.close(4000, 'Replaced by new connection')
	}
	//enregistrement nouveau socket et ajout dans la map
	dmConnections.set(userId, websocket)



	//handler des messages entrant
	websocket.on('message', async (raw: any) => {
		//parsing preventif en cas de JSON mal fait
		let message: DMPayload
		try {
			message = JSON.parse(raw.toString())
		} catch {return}

		//validation du type
		if (message.type !== 'DM') return
		if (typeof message.to !== 'string' || typeof message.content !== 'string') return

		//Normalisation et limitation du contenu
		const content = message.content.trim()
		if(!content || content.length > 1000) return
		//protection contre soit meme
		if (message.to === userId) return

		//verification de l'amitié au moment de l'envoi
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

		//presistence en DB
		const stored = await prisma.message.create({
			data: {
				sender_id: userId,
				receiver_id: message.to,
				content,
			},
		})

		//construction du payload pour le broadcast
		const payload = JSON.stringify({
			type: 'DM',
			id: stored.id,
			sender_id:userId,
			sender_username: username,
			receiver_id: message.to,
			content: stored.content,
			created_at :stored.created_at.toISOString(), //standard pour le passage reseau
		})
		websocket.send(payload)

		//si la target est pas co, on fait rien
		//sinon n envoie
		const receiverSocket = dmConnections.get(message.to)
		if(receiverSocket && receiverSocket.readyState === receiverSocket.OPEN) {
			receiverSocket.send(payload)
		}
	})

	//handler de fermeture de socket
	websocket.on('close', () => {
		if(dmConnections.get(userId) === websocket) {
			dmConnections.delete(userId)
		}
	})
}