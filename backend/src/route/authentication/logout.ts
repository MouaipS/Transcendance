import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from "../../server/prisma.js"
import "@fastify/jwt"

interface tokenLogOut {
	username: string;
}

export async function logoutRoute(request: FastifyRequest, reply: FastifyReply) {
       
	const refreshToken = request.cookies.refreshToken
	if (!refreshToken) return reply.code(401).send({ message: "no token"})
	
	try {
		const decoded = await request.server.jwt.verify(refreshToken) as tokenLogOut

        const foundUser = await prisma.user.findFirst({ 
            where: { username: decoded.username }   
        });

		if (!foundUser) return reply.code(403).send({ message: "Invalid refresh token - please log in"})

		await prisma.user.update({
			where: { username: foundUser.username },
			data: { 
				RefreshToken: {
					set: [...foundUser.RefreshToken.filter(rt => rt !== refreshToken)]
				}
			}
		});

	} catch(err) { return reply.code(401).send()}
		
	reply.clearCookie('refreshToken', { path: "/api/refresh" });
	reply.clearCookie('accessToken', { path: "/" });

    return reply.code(200).send({ message: "Logged Out" });
}