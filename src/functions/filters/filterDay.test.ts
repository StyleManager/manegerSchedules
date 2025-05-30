import { prisma } from "../../lib/prisma"
import {describe, it, expect, vi} from "vitest"
import { filterDay } from "./filterDay"

vi.mock("../../lib/prisma", ()=> ({
   prisma: {
        dias: {
            findUnique: vi.fn()
        }
   } 
}))

const dayFake = {
    id: "idFake",
    day: new Date()
}

describe("Filtra o dia no banco e traz o elemento prisma", () => {
    it("Deve ser possivel encontrar o dia", async ()=> {
        vi.mocked(prisma.dias.findUnique).mockResolvedValue(dayFake)

        const result = await filterDay(dayFake.id)
        expect(result).toMatchObject(dayFake)
    })
    it("Não deve ser retornado o dia, caso não seja encontrado pelo diaId fornecido", async ()=> {
        vi.mocked(prisma.dias.findUnique).mockResolvedValue(null)

        await expect(filterDay(dayFake.id))
        .rejects
        .toThrow("Erro ao tentar agendar horario!")
    })
})