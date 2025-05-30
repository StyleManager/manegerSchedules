import { prisma } from "../../lib/prisma"
import {describe, it, expect, vi} from "vitest"
import { filterHourDay } from "./filterDayHour"

vi.mock("../../lib/prisma", ()=> ({
   prisma: {
        dias_has_Horarios: {
            findUnique: vi.fn()
        }
   } 
}))

const dayHourFake = {
    id: "idFake",
    dayId: "dayidFake",
    horarioId: "horarioidFake",
}

describe("Filtra o dia no banco e traz o elemento prisma", () => {
    it("Deve ser possivel encontrar o dia", async ()=> {
        vi.mocked(prisma.dias_has_Horarios.findUnique).mockResolvedValue(dayHourFake)

        const result = await filterHourDay(dayHourFake.id)
        expect(result).toMatchObject(dayHourFake)
    })
    it("Não deve ser retornado o dia, caso não seja encontrado pelo diaId fornecido", async ()=> {
        vi.mocked(prisma.dias_has_Horarios.findUnique).mockResolvedValue(null)

        await expect(filterHourDay(dayHourFake.id))
        .rejects
        .toThrow("Dia invalido ou já lotado!")
    })
})

