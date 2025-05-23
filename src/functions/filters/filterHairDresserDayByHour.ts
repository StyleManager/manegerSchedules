import { prisma } from "../../lib/prisma";
import dayjs from "dayjs"
import { verifyDayHour } from "../days/verifyDayHour";

export async function filterHairDresserDayByHour({horario, cabeleleiroId}: {
    horario: string,
    cabeleleiroId: string
}){
    const hairDresserSchedules = await prisma.dias.findMany({
        where: {
            Dias_has_Horarios: {
                some: {
                    horario: {
                        horario: horario,
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
                        horario: horario,
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
                },
            }
        },
        orderBy: {
            day: "asc"
        }
    })
    if(!hairDresserSchedules){throw new Error("Horario não encontrado")}
    
    return hairDresserSchedules.flatMap(dia => {
        return dia.Dias_has_Horarios.map(horario => ({
            id: dia.id,
            day: dayjs(dia.day).format("DD/MM"),
            horarios: {
                horario: {
                    ...horario.horario
                },
                cabeleleiros: horario.cabeleleiro_has_Disponibilidade.map(c => ({
                    cabeleleiroId: c.cabeleleiroId,
                    nome: c.cabeleleiro.nome,
                    description: c.cabeleleiro.description
                }))
            }
        }))
        .filter(hFilter => verifyDayHour(dayjs(dia.day).format("DD/MM/YYY"), String(hFilter.horarios.horario.horario)))
    });
}