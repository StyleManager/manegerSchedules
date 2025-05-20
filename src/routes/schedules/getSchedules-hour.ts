import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import { verifyDayHour } from "../../functions/verifyDayHour";
import { verifyDay } from "../../functions/verifyDay";
import dayjs from "dayjs";

export function GetSchedulesDayByHour(server: FastifyTypedInstance){
    server.get("/schedules/free/day/:hour", {
        preHandler: Authenticate,
        schema: {
            description: "Horarios de atendimento do dia",
            params: z.object({
                hour: z.string(),
            }),
            // response: {
            //      200: z.array(
            //         z.object({
            //             horario: z.string(),
            //             dia: z.string(),
            //             diaId: z.string().uuid(),
            //             cabeleleiros: z.array(
            //                 z.object({
            //                     cabeleleiroId: z.string(),
            //                     nome: z.string(),
            //                     description: z.string()
            //                 }),
            //             )
            //         })
            //      ),
            //     401: z.object({
            //         message: z.string(),
            //     }),
            //     500: z.object({
            //         error: z.string()
            //     })
            // }
        }
    }, async (request, reply) => {
        const { hour } = request.params
        try {
            
            const dias = await prisma.dias.findMany({
                where: {
                    Dias_has_Horarios: {
                        some: {
                            horario: {
                                horario: hour,
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

            if (!dias) { return reply.status(401).send({message: "Horario não disponivel para agendamento!"})} 

            const data = dias.flatMap((d) => {
                if (!verifyDay(String(d.day))) return [];
                const dayFormatted = dayjs(d.day).format("DD/MM")

                const cabeleleiros = d.Dias_has_Horarios
                .map(DH => {
                    return DH.cabeleleiro_has_Disponibilidade
                    .map(c => ({
                        cabeleleiroId: c.cabeleleiroId,
                        nome: c.cabeleleiro.nome,
                        description: c.cabeleleiro.description
                    }))
                })
                
                const cabeleleirosUnicos = Array.from(
                    new Map(
                        cabeleleiros.flat().map(c => [c.cabeleleiroId, c])
                    ).values()
                );

                return {
                    horario: hour,
                    dia: dayFormatted,
                    diaId: d.id,
                    cabeleleiros: cabeleleirosUnicos
                }
            })

            if(data.length <= 0) {return reply.status(401).send({message: "Não há horarios disponiveis para este dia"})}

            return reply.status(200).send(data)
        } 
        catch (error) {
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}
