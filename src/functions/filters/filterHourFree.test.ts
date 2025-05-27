import {it, describe, expect, vi} from "vitest"
import { prisma } from "../../lib/prisma"
import { filterHourFree } from "./filterHourFree"

vi.mock("../../lib/prisma", () => ({
    prisma: {
        horarios: {
            findUnique: vi.fn()
        }
    }
}))

const horarioLivreFake = {
    id: "idFake",
    livre: true,
    horario: "horarioFake"
}

describe("filtro de horarios livres", ()=> {
    it("Deve retornar os horarios livres", async ()=> {
        vi.mocked(prisma.horarios.findUnique).mockResolvedValue(horarioLivreFake)

        const result = await filterHourFree(horarioLivreFake.id)
        expect(result).toMatchObject(horarioLivreFake)
    })
    it("Não deve retornar os horarios livres", async ()=> {
        vi.mocked(prisma.horarios.findUnique).mockResolvedValue(null)

        await expect(filterHourFree(horarioLivreFake.id))
        .rejects
        .toThrow("Erro ao tentar agendar horario!")

    })
})