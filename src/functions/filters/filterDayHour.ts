import { prisma } from "../../lib/prisma"

export async function filterHourDay(diaHorarioId: string){
    const data = await prisma.dias_has_Horarios.findUnique({  where: { id: diaHorarioId} })
    if(!data){ throw new Error("Dia invalido ou já lotado!")}
    return data
}