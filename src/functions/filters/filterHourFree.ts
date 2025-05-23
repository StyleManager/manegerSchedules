import { prisma } from "../../lib/prisma"

export async function filterHourFree(hour: string){
    const data =  await prisma.horarios.findUnique({
        where: {
            id: hour,
            livre: true,
        }
    })
    if(!data){ throw new Error("Erro ao tentar agendar horario!")}
    return data
}