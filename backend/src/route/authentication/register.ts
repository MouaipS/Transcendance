import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import { hash } from "bcrypt"
// import '@fastify/jwt'

interface RegisterBody {
  username: string;
  password: string;
}

export async function registerRoute(request : FastifyRequest<{Body: RegisterBody}>, reply : FastifyReply) 
{
	const {username} = request.body as any;

	// 1. Check if User already registered
	const findUser = await prisma.user.findUnique({
		where: { username : username } //can also put username only
	});
	if (findUser) return reply.code(401).send({ error: "User already exist" })

	// 2. Register User in database
	const hashedPassword = await hash(request.body.password, 10);
	const user = await prisma.user.create({
		data: {
			username : request.body.username,
			password: hashedPassword,
			stats: {
				create: {}
			}
		}
	}); console.log(user.username, " created")

	//3. Set the AccessToken
	const accessToken = await reply.jwtSign({
			username: user.username,
			id: user.id
		}, { 
			expiresIn: 60 * 3
		}
	); console.log("Access Token created")

	//4. Set the RefreshToken
	const refreshToken = await reply.jwtSign({
		username: user.username 
	}, {
		expiresIn: 60 * 10,
		// secret: process.env.REFRESH_TOKEN_SECRET
	});

	//5. Update database
	await prisma.user.update({
		where: { username : user.username },
		data: { 
			RefreshToken: {
				set: [...user.RefreshToken, refreshToken]
			}
		}
	}); console.log("Refresh Token created");


	//6. Set the Cookies
	reply.setCookie('accessToken', accessToken, {
        path: '/',
		secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 3
    });
	console.log("access cookie created")

	reply.setCookie('refreshToken', refreshToken, {
        path: '/api/refresh',
		secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 10
    });
	console.log("refresh cookie created")

	//4. Send response
	return reply.code(200).send({
		message: "Connexion suceeded",
		user: {
			id: user.id,
			username: user.username
		}
	});
}
