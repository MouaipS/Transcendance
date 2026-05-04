import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import { compare } from "bcrypt" //imports the compare prisma function
// import '@fastify/jwt'

interface LoginBody { //this is used to type the request body this prevents from error is types are not respected
  username: string; //like username = request.body.username as string
  password: string;
}

export async function loginRoute(request : FastifyRequest<{Body: LoginBody}>, reply : FastifyReply)
{
	// const cookies = request.cookies;
	const { username, password } = request.body as any;


	// 1. Verifie if User exist in database
	const findUser = await prisma.user.findUnique({
		where: { username : username } //can also put username only
	});
	if (!findUser) return reply.code(401).send({ error: "User doesn't exist" })


	//2. Check if Correct Password
	const pswdComp = await compare(password, findUser.password);//bcrypt function to check the hased password
	if (!pswdComp) return reply.code(401).send({ error: "Invalid password" })


	//3. Set the AccessToken
	const accessToken = await reply.jwtSign({
		username: findUser.username,
		id: findUser.id
	}, { 
		expiresIn: 60 * 3
	});
	console.log("Access Token created")

	//4. Set the RefreshToken
	const refreshToken = await reply.jwtSign({	
		username: findUser.username 
	}, {	
		expiresIn: 60 * 10,
		// secret: process.env.REFRESH_TOKEN_SECRET!
	}); 
	console.log("Refresh Token created")

	// update User in db
	await prisma.user.update({
		where: { username: findUser.username },
		data: { 
			RefreshToken: { 
				push: refreshToken,
			}
		}
	}); 
	console.log("Refresh Token created");

	//5. Set the Cookie
	reply.setCookie('accessToken', accessToken, {
        path: '/',
		secure: true,
        httpOnly: true,
        sameSite: 'strict',
       	maxAge: 60 * 3 // secondes
    }); 
	console.log("Access Token generated")

	reply.setCookie('refreshToken', refreshToken, {
        path: '/api/refresh',
		secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 10 // secondes
    });
	console.log("Refresh Token generated")


	//6. Send response
	return reply.code(200).send({
		message: "Connexion suceeded",
		user: { 
			id: findUser.id,
			username: findUser.username
		}
	});
}
