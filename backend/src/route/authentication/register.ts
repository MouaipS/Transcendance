import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import { hash } from "bcrypt"

interface RegisterBody {
  username: string;
  password: string;
}

export async function registerRoute(request : FastifyRequest<{Body: RegisterBody}>, reply : FastifyReply) 
{
	//const {username, password} = request.body;
	const hashedPassword = await hash(request.body.password, 10);
	const user = await prisma.user.create({
		data: {
			username : request.body.username,
			password: hashedPassword,
			stats: {
				create: {}
			}
		},
	});
	console.log("hashed : ",hashedPassword);
	console.log("headers register", request.headers);
	console.log("body register", request.body);
	console.log("url register", request.url);
	console.log(user);
	return;
}
