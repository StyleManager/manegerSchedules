import { handleCreateSchedule } from "../../functions/users/handleCreateSchedule";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";

export function ConfirmationLink(server: FastifyTypedInstance){
    server.get("/schedules/confirmation/:diaHorarioId/:userId/:servicoId", {
        schema: {
            description: "Confirmação do agendamento",
            params: z.object({
                diaHorarioId: z.string().uuid(),
                userId: z.string().uuid(),
                servicoId: z.string().uuid()
            }),
            response: {
                500: z.object({
                    error: z.string()
                }),
                401: z.object({
                    message: z.string()
                }),
                200: z.object({
                    id: z.string()
                })
            }
        }
    }, async (request, reply) => {
        try {
            const {diaHorarioId, userId, servicoId} = request.params
            
            const agendamento = await handleCreateSchedule({diaHorarioId, userId, servicoId})
            return reply.status(200).send({id: agendamento.id})
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro interno no servidor!"});
        }
    })
}