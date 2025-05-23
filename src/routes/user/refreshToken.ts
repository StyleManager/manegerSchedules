import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthService } from "../../services/authServices";

export const RefreshToken: FastifyPluginAsyncZod = async (server) => {
    server.post("/refresh/token/v1", async (request, reply) => {
        
       try {
            const authService = new AuthService(server.jwt);
            const token = request.cookies.RefreshToken;

            if(!token) {return reply.status(401).send({message: "Token não encontrado!"})};

            const {acessToken} = authService.refreshToken(token);
            return reply.status(201).send({
                message: "Login feito com sucesso!",
                "token": acessToken
            });
       } catch (error) {
            return reply.status(500).send({error: "erro interno do servidor!"});
       }
    })
}