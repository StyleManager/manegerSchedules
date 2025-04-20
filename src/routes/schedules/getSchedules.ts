import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";

export function GetSchedules(server: FastifyTypedInstance){
    server.get("/schedules/free", {
        preHandler: Authenticate,
        schema: {
            description: "Horarios de atendimento",
            response: {
                200: z.array(
                    z.object({
                        id: z.string(),
                        day: z.string(),
                        horarios: z.array(
                            z.object({
                                id: z.string(),
                                horario: z.string(),
                            })
                        )
                    })
                ),
                500: z.object({
                    error: z.string()
                })
            }
        }
    }, async (request, reply) => {
        try {
            const dias = await prisma.dias.findMany({
                include:{
                    Horarios: true,
                },
                orderBy: {
                    day: "asc",
                },
            });

            const agenda = dias.map((dias) => ({
                id: dias.id,
                day: dias.day.toISOString(),
                horarios: dias.Horarios
                .filter(h => h.livre === true)
                .map(horario => ({
                    id: horario.id,
                    horario: horario.horario,
                }))
            }))
            return reply.status(200).send(agenda);
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}
