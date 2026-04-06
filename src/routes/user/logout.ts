import { FastifyTypedInstance } from "../../types/fastifyTyped";

export function Logout(server: FastifyTypedInstance){
    server.post("/logout", {
        preHandler: [server.authenticate],
    }, async (request, reply) => {
        try { 
            const {user} = request;
          
            reply.setCookie("refreshToken", "", {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 0, 
            })

            return reply.status(200).send({message: "Logout feito com sucesso!"})
        } catch (error) {
            return reply.status(500).send({error: "Erro interno do servidor"})
        }
    })
}