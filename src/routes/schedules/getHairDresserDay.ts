import { verifyDayHour } from "../../functions/verifyDayHour";
import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import dayjs from "dayjs";
import { verifyDay } from "../../functions/verifyDay";

export function GetHairDresserDay(server: FastifyTypedInstance){
    server.get("/schedules/hairDresser/day/:horario/:cabeleleiroId", {
        preHandler: Authenticate,
        schema: {
            description: "Listagem dos tipos de sevicos",
            params: z.object({
                horario: z.string(),
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
            
            const {horario, cabeleleiroId} = request.params         
            const hairDresserSchedules = await prisma.dias.findMany({
                where: {
                    Dias_has_Horarios: {
                        some: {
                            horario: {
                                horario: horario,
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
                                horario: horario,
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
                       },
                    }
                },
                orderBy: {
                    day: "asc"
                }
            })
            if(!hairDresserSchedules){return reply.status(401).send({message: "Horario não encontrado"})}
            
           const dataFormatted = hairDresserSchedules.flatMap(dia => {
                return dia.Dias_has_Horarios.map(horario => ({
                    id: dia.id,
                    day: dayjs(dia.day).format("DD/MM"),
                    horarios: {
                        horario: {
                            ...horario.horario
                        },
                        cabeleleiros: horario.cabeleleiro_has_Disponibilidade.map(c => ({
                            cabeleleiroId: c.cabeleleiroId,
                            nome: c.cabeleleiro.nome,
                            description: c.cabeleleiro.description
                        }))
                    }
                }))
                .filter(hFilter => verifyDayHour(dayjs(dia.day).format("DD/MM/YYY"), String(hFilter.horarios.horario.horario)))
            });

            console.log(horario, "horario")
            console.log(cabeleleiroId, "cabeleleiroId")
           
            return reply.status(200).send(dataFormatted);
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}
