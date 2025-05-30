import {prisma} from "../../lib/prisma"
import {describe, it, vi, expect} from "vitest"
import { handleCreateService } from "./handleCreateService"

vi.mock("../../lib/prisma", () => ({
    prisma: {
        servicos: {
            create: vi.fn()
        }
    }
}))

const serviceFake = {
    tipoServicoId: "tipoServicoIdFake",
    cabeleleiroId: "cabeleleiroIdFake"
}

describe("Criação de serviços (handleCreateService)", ()=> {
    it("Deve ser possivel criar o teste", async ()=> {
        vi.mocked(prisma.servicos.create).mockResolvedValue({
            id: "1",
            ...serviceFake
        })

        const result = await handleCreateService(serviceFake)
        expect(result).toMatchObject({
            id: "1",
            ...serviceFake
        })
    })
})