import { prisma } from "../../lib/prisma"
import { filterHourDay } from "../filters/filterDayHour"

export async function handleCreateSchedule({diaHorarioId, userId, servicoId}: {
    diaHorarioId: string
    userId: string
    servicoId: string
}){
    const servico = await prisma.servicos.findUnique({where: {id: servicoId}})
    if (!servico) {throw new Error("Servico não encontrado, ocorreu algum erro ao fazer o agendamento")}

    const {dayId, horarioId, ...dataid} = await filterHourDay(diaHorarioId)

    const horarioUpdate = await prisma.horarios.update({ 
        where: {id: horarioId},
        data: {livre: false}
    })
    
    return await prisma.agendamentos.create({
        data: {         
            servicosId: servicoId, 
            clientId: userId,      
            cabeleleiroId: servico.cabeleleiroId,
            diasHorariosId: diaHorarioId,
            confirmado: true
        }
    })
}