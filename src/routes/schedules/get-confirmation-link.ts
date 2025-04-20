import { prisma } from "../../lib/prisma";
import { Authenticate } from "../../middleware/authenticator";
import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z, { string } from "zod";

export function ConfirmationLink(server: FastifyTypedInstance){
    server.get("/schedules/confirmation/:diaHorarioId/:userId/:servicoId", {
        schema: {
            description: "Horarios de atendimento",
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
                    id: string()
                })
            }
        }
    }, async (request, reply) => {
        const {diaHorarioId, userId, servicoId} = request.params
        try {
            const servico = await prisma.servicos.findUnique({where: {id: servicoId}})
            if (!servico) {return reply.status(401).send({message: "Servico não encontrado, ocorreu algum erro ao fazer o agendamento"})}

            const data = await prisma.dias_has_Horarios.findUnique({ where: {id: diaHorarioId}}) 
            if (!data) {return reply.status(401).send({message: "Dia e horario não encontrado!"})}
            const {dayId, horarioId, ...dataid} = data

            const horarioUpdate = await prisma.horarios.update({ 
                where: {id: data?.horarioId},
                data: {livre: false}
            })
           
            const agendamento = await prisma.agendamentos.create({
                data: {         
                    servicosId: servicoId, 
                    clientId: userId,      
                    cabeleleiroId: servico.cabeleleiroId,
                    diasHorariosId: diaHorarioId,
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
