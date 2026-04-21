import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import { prisma } from "../../server/prisma.js"
import { compare } from "bcrypt" //imports the compare prisma function
import '@fastify/jwt'

interface LoginBody { //this is used to type the request body this prevents from error is types are not respected
  username: string; //like username = request.body.username as string
  password: string;
}

export async function loginRoute(request : FastifyRequest<{Body: LoginBody}>, reply : FastifyReply)
{
	const {username, password} = request.body as any;
	
	//1. Verifie if User exist in database
	const user = await prisma.user.findUnique({
		where: {
			username : username, //can also put username only
		},
	});
	if (!user) //Cant make the comparison in the same if because the user can be false and types script says gngngngn tro nul le prgrammeur
	{
		console.log("User doesn't exist")
		return reply.code(401).send({
			error: "User doesn't exist"
		})
	}

	//2. Check if Correct Password
	const pswdComp = await compare(password, user.password);//bcrypt function to check the hased password
	if (!pswdComp)
	{
		console.log("Invalid password")
		return reply.code(401).send({
			error: "invalid password"
		})
	}

	//3. Set the Cookie and JWT Token
	const token = await reply.jwtSign({id:user.id, username: user.username}, {expiresIn: '1h' });
	console.log("token : ", token);
	reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600 // (secondes)
    });
	console.log("Connexion Succeeded")
	return reply.code(200).send({
		message: "Connexion suceeded",
		user: { id: user.id, username: user.username}
	})
}
