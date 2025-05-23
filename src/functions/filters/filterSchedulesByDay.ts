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

    const data = horarios.Dias_has_Horarios
    .filter(h => h.horario.livre === true)
    .map(horario => ({
        horario: {
            diaHorarioId: horario.id,
            ...horario.horario
        },
        cabeleleiros: horario.cabeleleiro_has_Disponibilidade
        .map(c => ({
            cabeleleiroId: c.cabeleleiroId,
            nome: c.cabeleleiro.nome,
            description: c.cabeleleiro.description
        }))
    }))
    .filter(hFilter => verifyDayHour(day, String(hFilter.horario.horario)))

    if(data.length <= 0) { throw new Error("Não há horarios disponiveis para este dia")}
    return data;
}