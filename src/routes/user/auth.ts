import { FastifyTypedInstance } from "../../types/fastifyTyped";

export const AuthRoute = (server: FastifyTypedInstance) => {
    server.get("/auth", {
        preHandler: [server.authenticate]
    }, async (request, reply) => {
        try {
            const {user} = request;

            return reply.status(200).send({authenticated: true})
        } catch (error) {
            return reply.status(401).send({ authenticated: false})
        }
    })
}