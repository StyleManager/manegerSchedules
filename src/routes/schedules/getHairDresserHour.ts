import { verifyDayHour } from "../../functions/verifyDayHour";
import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import dayjs from "dayjs";
import { verifyDay } from "../../functions/verifyDay";

export function GetHairDresserHour(server: FastifyTypedInstance){
    server.get("/schedules/hairDresser/hour/:day/:cabeleleiroId", {
        preHandler: Authenticate,
        schema: {
            description: "Listagem dos tipos de sevicos",
            params: z.object({
                day: z.string(),
                cabeleleiroId: z.string()
            }),
            response: {
                 200: z.array(
                    z.object({
                        id: z.string(),
                        day: z.string(),
                        horarios: z.object({
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
                                })
                            )
                        })
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
            
            const {day, cabeleleiroId} = request.params
            const checkDay = verifyDay(day);
            if(!checkDay) {return reply.status(401).send({message: "Dia invalido!"})}

            const start = dayjs(day).startOf("day").toDate()
            const end = dayjs(day).endOf("day").toDate()

            const hairDresserSchedules = await prisma.dias.findFirst({
                where: {
                    day: {
                        gte: start,
                        lte: end
                    },
                    Dias_has_Horarios: {
                        some: {
                            horario: {
                                livre: true
                            },
                            cabeleleiro_has_Disponibilidade: {
                                some: {
                                    cabeleleiroId,
                                }
                            }
                        },
                    }
                },
                include: {
                    Dias_has_Horarios: {
                       where: {
                            horario: {
                                livre: true,
                            },
                            cabeleleiro_has_Disponibilidade: {
                                some: {
                                    cabeleleiroId,
                                }
                            }                            
                       },
                       include: {
                            horario: true,
                            cabeleleiro_has_Disponibilidade: {
                                where: {
                                    cabeleleiroId,
                                },
                                include: {
                                    cabeleleiro: true
                                }
                            }
                       }
                    }
                },
            })
            if(!hairDresserSchedules){return reply.status(401).send({message: "Horario não encontrado"})}
            
            const dataFormatted = hairDresserSchedules.Dias_has_Horarios
             .sort((a, b) => {
                const horarioA = a.horario.horario;
                const horarioB = b.horario.horario;
                return horarioB.localeCompare(horarioA); // ordem decrescente
            })
            .map(horario => ({
                id: horario.id,
                day: dayjs(hairDresserSchedules.day).format("DD/MM"),
                horarios: {
                    horario: {
                         ...horario.horario
                    },
                    cabeleleiros: horario.cabeleleiro_has_Disponibilidade
                    .map(c => ({
                        cabeleleiroId: c.cabeleleiroId,
                        nome: c.cabeleleiro.nome,
                        description: c.cabeleleiro.description
                    }))
                },
            }))
            .filter(scheduleItem => scheduleItem.horarios.horario.horario.length > 0)
           
            return reply.status(200).send(dataFormatted);
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}
