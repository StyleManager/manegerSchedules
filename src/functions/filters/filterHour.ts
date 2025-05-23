import { prisma } from "../../lib/prisma"

export async function filterHour(hourId: string){
   const hour = await prisma.horarios.findUnique({ where: { id: hourId }})
    if(!hour){ throw new Error("Erro ao tentar agendar horario!")}
    return hour
}