import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";

export function GetSchedules(server: FastifyTypedInstance){
    server.get("/schedules/free", {
        preHandler: Authenticate,
        schema: {
            description: "Todos os Horarios de atendimento",
            response: {
                200: z.array(
                    z.object({
                        id: z.string(),
                        day: z.string(),
                        horarios: z.array(
                            z.object({
                                id: z.string(),
                                horario: z.object({
                                    id: z.string(),
                                    horario: z.string(),
                                    livre: z.boolean()
                                }),
                                cabeleleiros: z.array(
                                    z.object({
                                        cabeleleiroId: z.string(),
                                        nome: z.string(),
                                        description: z.string()
                                    }),
                                )
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
                include: {
                    Dias_has_Horarios:{
                        include: {
                            cabeleleiro_has_Disponibilidade:{
                                include: {
                                    cabeleleiro: true
                                }
                            },
                            horario: true,
                        }
                    }
                },
                orderBy: {
                    day: "asc",
                }
            })

            const agenda = dias.map((dias) => ({
                id: dias.id,
                day: dias.day.toISOString(),
                horarios: dias.Dias_has_Horarios
                .filter(h => h.horario.livre === true)
                .map(horario => ({
                    id: horario.id,
                    horario: horario.horario,
                    cabeleleiros: horario.cabeleleiro_has_Disponibilidade
                    .map(c => ({
                        cabeleleiroId: c.cabeleleiroId,
                        nome: c.cabeleleiro.nome,
                        description: c.cabeleleiro.description
                    }))
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
