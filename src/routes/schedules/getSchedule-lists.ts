import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import { filterSchedules } from "../../functions/filters/filterSchedules";

export function GetSchedules(server: FastifyTypedInstance){
    server.get("/schedules/free", {
        preHandler: Authenticate,
        schema: {
            description: "Lista todos os Horarios de atendimento",
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

            const data = await filterSchedules();
            return reply.status(200).send(data);
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}