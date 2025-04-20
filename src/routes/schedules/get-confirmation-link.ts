import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z, { string } from "zod";

export function ConfirmationLink(server: FastifyTypedInstance){
    server.get("/schedules/confirmation/:horarioId/:userId", {
        schema: {
            description: "Horarios de atendimento",
            params: z.object({
                horarioId: z.string(),
                userId: z.string()
            }),
            response: {
                500: z.object({
                    error: z.string()
                }),
                401: z.object({
                    message: z.string()
                }),
                200: z.object({
                    id: string()
                })
            }
        }
    }, async (request, reply) => {
        const {horarioId, userId} = request.params
        try {

            const horario = await prisma.horarios.update({
                where: {id: horarioId},
                data: {livre: false}
            })

            const agendamento = await prisma.agendamentos.create({
                data: {          
                    clientId: userId,      
                    dayId: horario.dayId,        
                    horarioId: horario.id,   
                    confirmado: true    
                }
            })

            return reply.status(200).send({id: agendamento.id})
        } 
        catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Ocorreu um erro interno no servidor!"});
        }
    })
}
