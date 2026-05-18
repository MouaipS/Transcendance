import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from "../../server/prisma.js"

interface tokenLogOut {
	id: string;
}

export async function logoutRoute(request: FastifyRequest, reply: FastifyReply) {
       
	const refreshToken = request.cookies.refreshToken
	if (!refreshToken) return reply.code(401).send({ message: "Logout: no token"})
	
	try {
		const decoded = await request.server.jwt.verify(refreshToken) as tokenLogOut

        const foundUser = await prisma.user.findFirst({ 
            where: { id: decoded.id }   
        });

		if (!foundUser) return reply.code(403).send({ message: "Logout: Invalid refresh token"})

		await prisma.user.update({
			where: { id: foundUser.id },
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
