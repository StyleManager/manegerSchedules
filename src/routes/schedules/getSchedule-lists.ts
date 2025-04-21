import dayjs from "dayjs";
import { verifyDayHour } from "../../functions/verifyDayHour";
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
                                horario: z.object({
                                    diaHorarioId: z.string(),
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

            const agenda = dias
            .map((dias) => {
                const dayFormated = dayjs(dias.day).format("DD/MM")

                return {
                    id: dias.id,
                    day: dayFormated,
                    horarios: dias.Dias_has_Horarios
                    .filter(h => h.horario.livre === true)
                    .map(hMap => ({
                        horario: {
                            diaHorarioId: hMap.id,
                            ...hMap.horario
                        },
                        cabeleleiros: hMap.cabeleleiro_has_Disponibilidade
                        .map(c => ({
                            cabeleleiroId: c.cabeleleiroId,
                            nome: c.cabeleleiro.nome,
                            description: c.cabeleleiro.description
                        }))
                    }))
                    .filter(hFilter => verifyDayHour(dayFormated, String(hFilter.horario.horario)))
                }
            })
            .filter(agendaItem => agendaItem.horarios.length > 0)

            return reply.status(200).send(agenda);
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}
