import { prisma } from "../../lib/prisma"

export async function filterDay(dayId: string){
   const day = await prisma.dias.findUnique({ where: { id: dayId }})
    if(!day){ throw new Error("Erro ao tentar agendar horario!")}
    return day
}