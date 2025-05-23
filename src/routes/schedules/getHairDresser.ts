import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";

export function GetHairDresser(server: FastifyTypedInstance){
    server.get("/schedules/hairDresser", {
        preHandler: Authenticate,
        schema: {
            description: "Listagem dos profissionais",
            response: {
                 200: z.array(
                    z.object({
                        description: z.string(),
                        id: z.string(),
                        nome: z.string(),
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
            const hairDresser = await prisma.cabeleleiros.findMany();
            if(!hairDresser) {return reply.status(401).send({message: "Error ao tentar encontrar os cabeleleiros"})}
            return reply.status(200).send(hairDresser);
        } 
        catch (error) {
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}