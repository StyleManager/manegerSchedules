import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";

export function GetTypeSchedules(server: FastifyTypedInstance){
    server.get("/schedules/type", {
        preHandler: Authenticate,
        schema: {
            description: "Listagem dos tipos de sevicos",
            response: {
                 200: z.array(
                    z.object({
                        id: z.string(),
                        nome: z.string(),
                        Preco: z.number()
                    })
                 ),
                401: z.object({
                    message: z.string(),
                }),
                500: z.object({
                    error: z.string()
                })
            }
        }
    }, async (request, reply) => {
        try {
            const typesServices = await prisma.tipoServico.findMany();
            return reply.status(200).send(typesServices);
        } 
        catch (error) {
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}