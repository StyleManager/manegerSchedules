import { prisma } from "../../lib/prisma"
import {describe, it, expect, vi} from "vitest"
import { filterHour } from "./filterHour"

vi.mock("../../lib/prisma", ()=> ({
   prisma: {
        horarios: {
            findUnique: vi.fn()
        }
   } 
}))

const horarioFake = {
    id: "idFake",
    horario: "horarioFake",
    livre: true
}

describe("Filtra o dia no banco e traz o elemento prisma", () => {
    it("Deve ser possivel encontrar o horario", async ()=> {
        vi.mocked(prisma.horarios.findUnique).mockResolvedValue(horarioFake)

        const result = await filterHour(horarioFake.id)
        expect(result).toMatchObject(horarioFake)
    })
    it("Não deve ser retornado o horario, caso não seja encontrado pelo horarioId fornecido", async ()=> {
        vi.mocked(prisma.horarios.findUnique).mockResolvedValue(null)

        await expect(filterHour(horarioFake.id))
        .rejects
        .toThrow("Erro ao tentar agendar horario!")
    })
})