    import  jwt  from "jsonwebtoken";
    import { env } from "../env";
    import { FastifyReply, FastifyRequest } from "fastify";

    export async function Authenticate(request: FastifyRequest, reply: FastifyReply){
        const authentication = request.headers.authorization;

        if(!authentication){
            return reply.status(401).send({error: "Credencias invalidas!"});
        }

        const token = authentication.split(" ")[1];
        try{
            const decoded = jwt.verify(token, env.SECRET_KEY);
            (request as any).user = decoded;
        }
        catch(error){
            return reply.status(500).send({error: "Erro interno do servidor!"});
        }
    }