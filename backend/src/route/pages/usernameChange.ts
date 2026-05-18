import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

export async function usernameChange(request : FastifyRequest, reply : FastifyReply)
{
	const {id} = request.user as {id : string};
	const {username} = request.body as {username : string}
	const { newusername : newUsername } = request.body as { newusername: string };
	console.log("la username change route de ses mort");
	console.log("username : ", username)
	console.log("new username : ", newUsername)
	const findUser = await prisma.user.findUnique({
		where: {username : newUsername}
	});
	if (findUser) return reply.code(409).send({error: "Username is already is used"});
	await prisma.user.update(
	{
  		where: { id: id},
  		data: { username: newUsername},
	});
	return reply.code(200).send({message : "Username changed"});
}
