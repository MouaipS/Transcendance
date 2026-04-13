import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"

interface RegisterBody {
  username: string;
  password: string;
}

export async function registerRoute(request : FastifyRequest<{Body: RegisterBody}>, reply : FastifyReply) 
{
	const {username, password} = request.body;
	const user = await prisma.user.create({
		data: {
			username,
			password
		},
	});
	console.log("headers register", request.headers);
	console.log("body register", request.body);
	console.log("url register", request.url);
	console.log(user);
	return;
}
