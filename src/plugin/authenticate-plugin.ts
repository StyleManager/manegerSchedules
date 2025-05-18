import fp from "fastify-plugin";
import {FastifyReply, FastifyRequest, FastifyInstance} from "fastify"
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import { env } from "../env";

export default fp(async (server: FastifyInstance) => {
    server.register(cookie);
    server.register(jwt, {
        secret: env.SECRET_KEY,
        sign: { expiresIn: "2h"}
    })

    server.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
       try {
            await request.jwtVerify();
       } catch (error) {
            return reply.status(500).send({message: "Token Invalido!"})
       } 
    })
})