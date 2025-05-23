import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import { verifyDay } from "../../functions/days/verifyDay";
import { filterHairDresserHourByDay } from "../../functions/filters/filterHairDresserHourByDay";

export function GetHairDresserHour(server: FastifyTypedInstance){
    server.get("/schedules/hairDresser/hour/:day/:cabeleleiroId", {
        preHandler: Authenticate,
        schema: {
            description: "Lista os profissionais pelo dia",
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
            const {day, cabeleleiroId} = request.params;
            const checkedDay = verifyDay(day);
            if(!checkedDay) {throw new Error("Dia invalido!")}
            const data = await filterHairDresserHourByDay({day, cabeleleiroId});
            return reply.status(200).send(data);
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
        }
    })
}