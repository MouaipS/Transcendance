import { prisma } from "../../server/prisma.js"
import { FastifyRequest, FastifyReply } from 'fastify'

interface tokenDecoded {
	username: string;
}

export async function refreshRoute(request: FastifyRequest, reply: FastifyReply) {

    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) return reply.code(401).send({ error: "no refreshToken"})
    
    try {
        const foundUser = await prisma.user.findFirst({ 
            where: { RefreshToken: { has: refreshToken }}   
        });
        
        if (!foundUser) {
                
            try {
                const decoded = await request.server.jwt.verify(refreshToken) as tokenDecoded
                await prisma.user.update({
                    where: { username: decoded.username},
                    data: { RefreshToken: { set: [] }}
                });
                return reply.code(401).send({ message: "refreshToken Hacked. DB cleared"})

            } catch (err) { return reply.code(401).send({ message: "Invalid refreshToken"}) }
        }

        const accessToken = await reply.jwtSign({
            username: foundUser.username,
            id: foundUser.id
        }, {   
            expiresIn: 60 * 15
        });
        
        console.log("access token")
        const newRefreshToken = await reply.jwtSign({
            username: foundUser.username,
        }, {
            expiresIn: 60 * 60
        });

        console.log("refresh token")
        await prisma.user.update({
            where: { id: foundUser.id },
            data: { 
                RefreshToken: {
                    set: [...foundUser.RefreshToken.filter(rt => rt !== refreshToken), newRefreshToken] 
                }
            }
        });

        reply.setCookie("accessToken", accessToken, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 15
        });

        reply.setCookie("refreshToken", newRefreshToken, {
            path: "/api/refresh",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60
        });

        console.log("cookies set")
        return reply.code(200).send({ message: "refresh success" })

    } catch(err) { return reply.code(401).send({ error: "token expired or invalid"})}
}