import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z, { string } from "zod";
import dayjs from "dayjs";
import { verifyDay } from "../../functions/verifyDay";
import { verifyDayHour } from "../../functions/verifyDayHour";

export function GetSchedulesHourByDay(server: FastifyTypedInstance){
    server.get("/schedules/free/hour/:day", {
        preHandler: Authenticate,
        schema: {
            description: "Horarios de atendimento do dia",
            params: z.object({
                day: z.string(),
            }),
            response: {
                 200: z.array(
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
        const { day } = request.params
        try {

            const dayChecked = verifyDay(day)
            if(!dayChecked) {return reply.status(401).send({message: "Dia invalido!"})}

            const start = dayjs(day).startOf("day").toDate()
            const end = dayjs(day).endOf("day").toDate()
            
            const horarios = await prisma.dias.findFirst({
                where: {
                    day: {
                        gte: start,
                        lte: end
                    },
                    Dias_has_Horarios: {
                        some: {
                            horario: {
                                livre: true
                            }
                        }
                    }
                },
                include: {
                    Dias_has_Horarios: {
                        include: {
                            cabeleleiro_has_Disponibilidade: {
                                include: {
                                    cabeleleiro: true
                                }
                            },
                            horario: true,
                        }
                    }
                },
            })

            if (!horarios) { return reply.status(401).send({message: "Horario não disponivel para agendamento!"})} 

            const data = horarios.Dias_has_Horarios
            .filter(h => h.horario.livre === true)
            .map(horario => ({
                horario: {
                    diaHorarioId: horario.id,
                    ...horario.horario
                },
                cabeleleiros: horario.cabeleleiro_has_Disponibilidade
                .map(c => ({
                    cabeleleiroId: c.cabeleleiroId,
                    nome: c.cabeleleiro.nome,
                    description: c.cabeleleiro.description
                }))
            }))
            .filter(hFilter => verifyDayHour(day, String(hFilter.horario.horario)))

            if(data.length <= 0) {return reply.status(401).send({message: "Não há horarios disponiveis para este dia"})}

            return reply.status(200).send(data)
        } 
        catch (error) {
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}
