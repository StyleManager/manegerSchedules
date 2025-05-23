import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import { filterSchedulesByHour } from "../../functions/filters/filterSchedulesByHour";

export function GetSchedulesDayByHour(server: FastifyTypedInstance){
    server.get("/schedules/free/day/:hour", {
        preHandler: Authenticate,
        schema: {
            description: "Lista os dias atendimento de um horario",
            params: z.object({
                hour: z.string(),
            }),
            response: {
                 200: z.array(
                    z.object({
                        horario: z.string(),
                        dia: z.string(),
                        diaId: z.string().uuid(),
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
        const { hour } = request.params
        try {
            const data = await filterSchedulesByHour({hour})
            return reply.status(200).send(data)
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}