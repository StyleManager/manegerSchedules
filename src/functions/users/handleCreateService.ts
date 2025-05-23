import { prisma } from "../../lib/prisma"

export async function handleCreateService({tipoServicoId, cabeleleiroId}: {
    tipoServicoId: string
    cabeleleiroId: string
}){
    
    return await prisma.servicos.create({
        data: {
            tipoServicoId,
            cabeleleiroId,
        }
    })

}