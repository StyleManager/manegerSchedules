import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z, { string } from "zod";
import dayjs from "dayjs";

export function GetSchedulesDay(server: FastifyTypedInstance){
    server.get("/schedules/free/day/:day", {
        preHandler: Authenticate,
        schema: {
            description: "Horarios de atendimento",
            params: z.object({
                day: z.string(),
            }),
            response: {
                200: z.object({
                    dayId: string().uuid(),
                    horarios: z.array(
                        z.object({
                            id: z.string(),
                            horario: z.string()
                        })
                    ),
                }),
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
            
            const start = dayjs(day).startOf("day").toDate()
            const end = dayjs(day).endOf("day").toDate()
            
            const horarios = await prisma.dias.findFirst({
                where: {
                    day: {
                        gte: start,
                        lte: end
                    }
                },
                include: {
                    Horarios: true,
                }
            })

            if (!horarios) { return reply.status(401).send({message: "Erro ao procurar dia"})} 

            const horariosArray = horarios.Horarios
            .filter(h => h.livre === true )
            .map(h => {
                return {
                    id: h.id,
                    horario: h.horario
                }
            })

            const data = {
                dayId: horarios.id,
                horarios: horariosArray
            }

            return reply.status(200).send(data)
        } 
        catch (error) {
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}
