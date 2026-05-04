import { prisma } from "../../server/prisma.js"
import { FastifyRequest, FastifyReply } from 'fastify'
// import '@fastify/jwt'


export async function refreshRoute(request: FastifyRequest, reply: FastifyReply) {

    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) return reply.code(401).send({ error: "no token"})
    
    try {
        console.log("refresh")
        const decoded = await request.server.jwt.verify(refreshToken)
        const foundUser = await prisma.user.findFirst({ 
            where: { 
                RefreshToken: { has: refreshToken }
            }   
        });

        console.log("user found")
        // supprimer le tableau de RefreshToken du user
        if (!foundUser) return reply.code(403).send({ message: "Invalid refresh token - please log in"})

        const accessToken = await reply.jwtSign({
            username: foundUser.username,
            id: foundUser.id
        }, {   
            expiresIn: 60 * 3
        });
        
        console.log("access token")
        const newRefreshToken = await reply.jwtSign({
            username: foundUser.username,
        }, {
            expiresIn: 60 * 10,
            // secret: process.env.REFRESH_TOKEN_SECRET
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
            maxAge: 60 * 3
        });

        reply.setCookie("refreshToken", newRefreshToken, {
            path: "/api/refresh",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 10
        });

        console.log("cookies set")
        return reply.code(200).send({ message: "refresh success" })

    } catch(err) { return reply.code(401).send({ error: "token expired or invalid"})}
}