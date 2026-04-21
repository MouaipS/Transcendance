import { FastifyReply } from 'fastify'

export async function logoutRoute(reply: FastifyReply) {
       
    //1. Set cookie to NULL
    reply.setCookie('token', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 0
    });

    return reply.code(200).send({
        message: "Logged Out"
    });
}