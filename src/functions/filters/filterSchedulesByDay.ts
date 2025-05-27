import dayjs from "dayjs";
import {prisma} from "../../lib/prisma";
import { verifyDayHour } from "../days/verifyDayHour";

export async function filterSchedulesByDay({day}: {
    day: string
}){
    const start = dayjs(day).startOf("day").toDate()
    const end = dayjs(day).endOf("day").toDate()
    
    const horarios = await prisma.dias.findFirst({
        where: {
            day: {
                gte: start,
                lte: end
            },
            Dias_has_Horarios: {
                some: {
                    horario: {
                        livre: true
                    }
                }
            }
        },
        include: {
            Dias_has_Horarios: {
                include: {
                    cabeleleiro_has_Disponibilidade: {
                        include: {
                            cabeleleiro: true
                        }
                    },
                    horario: true,
                }
            }
        },
    })

    if (!horarios) {throw new Error("Horario não disponivel para agendamento!")} 

    const data: any[] = []

    for (const horario of horarios.Dias_has_Horarios.filter(h => h.horario.livre)) {
    const isAvailable = await verifyDayHour(day, String(horario.horario.horario))
    if (isAvailable) {
        data.push({
        horario: {
            diaHorarioId: horario.id,
            ...horario.horario
        },
        cabeleleiros: horario.cabeleleiro_has_Disponibilidade.map(c => ({
            cabeleleiroId: c.cabeleleiroId,
            nome: c.cabeleleiro.nome,
            description: c.cabeleleiro.description
        }))
        })
    }
}


    if(data.length <= 0) { throw new Error("Não há horarios disponiveis para este dia")}
    return data;
}