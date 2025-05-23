import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import { filterHairDresserDayByHour } from "../../functions/filters/filterHairDresserDayByHour";

export function GetHairDresserDay(server: FastifyTypedInstance){
    server.get("/schedules/hairDresser/day/:horario/:cabeleleiroId", {
        preHandler: Authenticate,
        schema: {
            description: "Lista os Cabeleleiros pelo horario",
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
            const {horario, cabeleleiroId} = request.params; 

            const data = await filterHairDresserDayByHour({horario, cabeleleiroId});        
            return reply.status(200).send(data);
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}