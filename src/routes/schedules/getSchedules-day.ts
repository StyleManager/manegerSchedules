import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import { verifyDay } from "../../functions/days/verifyDay";
import { filterSchedulesByDay } from "../../functions/filters/filterSchedulesByDay";

export function GetSchedulesHourByDay(server: FastifyTypedInstance){
    server.get("/schedules/free/hour/:day", {
        preHandler: Authenticate,
        schema: {
            description: "Lista os horarios de atendimento do dia",
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
            const checkedDay = verifyDay(day);
            if(!checkedDay) {throw new Error("Dia invalido!")}
            const data = await filterSchedulesByDay({day})
            return reply.status(200).send(data)
        } 
        catch (error) {
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}