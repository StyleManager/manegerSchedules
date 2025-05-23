import dayjs from "dayjs";
import {prisma} from "../../lib/prisma";
import { verifyDay } from "../days/verifyDay";

export async function filterSchedulesByHour({hour}: {
    hour: string,
}) {
    const dias = await prisma.dias.findMany({
        where: {
            Dias_has_Horarios: {
                some: {
                    horario: {
                        horario: hour,
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

    if (!dias) { throw new Error("Horario não disponivel para agendamento!")} 

    const data = dias.flatMap((d) => {
        if (!verifyDay(String(d.day))) return [];
        const dayFormatted = dayjs(d.day).format("DD/MM")

        const cabeleleiros = d.Dias_has_Horarios
        .map(DH => {
            return DH.cabeleleiro_has_Disponibilidade
            .map(c => ({
                cabeleleiroId: c.cabeleleiroId,
                nome: c.cabeleleiro.nome,
                description: c.cabeleleiro.description
            }))
        })
        
        const cabeleleirosUnicos = Array.from(
            new Map(
                cabeleleiros.flat().map(c => [c.cabeleleiroId, c])
            ).values()
        );

        return {
            horario: hour,
            dia: dayFormatted,
            diaId: d.id,
            cabeleleiros: cabeleleirosUnicos
        }
    })

    if(data.length <= 0) {throw new Error("Não há horarios disponiveis para este dia")}
    return data;
}