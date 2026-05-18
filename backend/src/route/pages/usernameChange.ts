import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

export async function usernameChange(request : FastifyRequest, reply : FastifyReply)
{
	const {id} = request.user as {id : string};
	const { newusername : newUsername } = request.body as { newusername: string };
	if (newUsername.length < 3)
		return reply.code(409).send({error : "Username must be at least 3 character long", code :"SHORT"})
	const findUser = await prisma.user.findUnique({
		where: {username : newUsername}
	});
	if (findUser) return reply.code(409).send({error: "Username is already is used", code : "EXIST"});
	await prisma.user.update(
	{
  		where: { id: id},
  		data: { username: newUsername},
	});
	return reply.code(200).send({message : "Username changed"});
}
