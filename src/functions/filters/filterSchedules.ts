import dayjs from "dayjs"
import {prisma} from "../../lib/prisma"
import { verifyDayHour } from "../days/verifyDayHour"

export async function filterSchedules(){
    const dias = await prisma.dias.findMany({
        include: {
            Dias_has_Horarios:{
                include: {
                    cabeleleiro_has_Disponibilidade:{
                        include: {
                            cabeleleiro: true
                        }
                    },
                    horario: true,
                }
            }
        },
        orderBy: {
            day: "asc",
        }
    })

    return dias
    .map((dias) => {
        const dayFormated = dayjs(dias.day).format("DD/MM")

        return {
            id: dias.id,
            day: dayFormated,
            horarios: dias.Dias_has_Horarios
            .filter(h => h.horario.livre === true)
            .map(hMap => ({
                horario: {
                    diaHorarioId: hMap.id,
                    ...hMap.horario
                },
                cabeleleiros: hMap.cabeleleiro_has_Disponibilidade
                .map(c => ({
                    cabeleleiroId: c.cabeleleiroId,
                    nome: c.cabeleleiro.nome,
                    description: c.cabeleleiro.description
                }))
            }))
            .filter(hFilter => verifyDayHour(dayFormated, String(hFilter.horario.horario)))
        }
    })
    .filter(agendaItem => agendaItem.horarios.length > 0)
}