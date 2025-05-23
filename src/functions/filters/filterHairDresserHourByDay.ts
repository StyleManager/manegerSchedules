import { prisma } from "../../lib/prisma";
import dayjs from "dayjs"
import { verifyDayHour } from "../days/verifyDayHour";

export async function filterHairDresserHourByDay({day, cabeleleiroId}: {
    day: string,
    cabeleleiroId: string
}){
    const start = dayjs(day).startOf("day").toDate()
    const end = dayjs(day).endOf("day").toDate()

    const hairDresserSchedules = await prisma.dias.findFirst({
        where: {
            day: {
                gte: start,
                lte: end
            },
            Dias_has_Horarios: {
                some: {
                    horario: {
                        livre: true
                    },
                    cabeleleiro_has_Disponibilidade: {
                        some: {
                            cabeleleiroId,
                        }
                    }
                },
            }
        },
        include: {
            Dias_has_Horarios: {
                where: {
                    horario: {
                        livre: true,
                    },
                    cabeleleiro_has_Disponibilidade: {
                        some: {
                            cabeleleiroId,
                        }
                    }                            
                },
                include: {
                    horario: true,
                    cabeleleiro_has_Disponibilidade: {
                        where: {
                            cabeleleiroId,
                        },
                        include: {
                            cabeleleiro: true
                        }
                    }
                }
            }
        },
    })
    if(!hairDresserSchedules){throw new Error("Horario não encontrado")}
    
    return hairDresserSchedules.Dias_has_Horarios
        .sort((a, b) => {
        const horarioA = a.horario.horario;
        const horarioB = b.horario.horario;
        return horarioB.localeCompare(horarioA); // ordem decrescente
    })
    .map(horario => ({
        id: horario.id,
        day: dayjs(hairDresserSchedules.day).format("DD/MM"),
        horarios: {
            horario: {
                    ...horario.horario
            },
            cabeleleiros: horario.cabeleleiro_has_Disponibilidade
            .map(c => ({
                cabeleleiroId: c.cabeleleiroId,
                nome: c.cabeleleiro.nome,
                description: c.cabeleleiro.description
            }))
        },
    }))
    .filter(scheduleItem => scheduleItem.horarios.horario.horario.length > 0)
};
