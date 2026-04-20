import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import { hash } from "bcrypt"
import '@fastify/jwt'

interface RegisterBody {
  username: string;
  password: string;
}

export async function registerRoute(request : FastifyRequest<{Body: RegisterBody}>, reply : FastifyReply) 
{
	//const {username, password} = request.body;

	// 1. Check if User already registered
	const {username} = request.body;
	const findUser = await prisma.user.findUnique({
		where: {
			username : username, //can also put username only
		},
	});
	if (findUser)
	{
		console.log("User already exist")
		return reply.code(401).send({
			error: "User already exist"
		})
	}

	// 2. Register User in database
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
	console.log("DB - user created")
	//console.log("hashed : ",hashedPassword);
	//console.log("headers register", request.headers);
	//console.log("body register", request.body);
	//console.log("url register", request.url);
	//console.log(user);

	//3. Set the Cookie and JWT token
	const token = await reply.jwtSign({id:user.id, username: user.username}, {expiresIn: '1h' });
	console.log("token : ", token);
	reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600 // (secondes)
    });
	console.log("DB - Token and cookie created")

	//4. Send response
	return reply.code(200).send({
		message: "Connexion suceeded",
		user: { id: user.id, username: user.username}
	})
}
