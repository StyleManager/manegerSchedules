import { prisma } from "../../lib/prisma";
import {vi, describe, it, expect, beforeEach} from "vitest"
import { filterHairDresserDayByHour } from "./filterHairDresserDayByHour";
import { verifyDayHour } from "../days/verifyDayHour";
import dayjs from "dayjs";

const dataExpected = {
    horario: "horarioFake",
    cabeleleiroId: "cabeleleiroIdFake"
}

const schedulesFake = [
  {
    id: "idFake",
    day: new Date(),
    Dias_has_Horarios: [
      {
        horario: {
            id: "idFake",
            livre: true,
            horario: "horarioFake"
        },
        cabeleleiro_has_Disponibilidade: [{
             cabeleleiroId: "cabeleleiroIdFake",
             cabeleleiro: {
                nome: "nomeFake",
                description: "descriptionFake",
            }
        }]
      }
    ]
  }
]

const scheduleFormatedFake = {
    id: 'idFake',
    day: dayjs(new Date()).format("DD/MM"),
    horarios: { 
        horario: {
            id: "idFake",
            horario: "horarioFake",
            livre: true
        },
        cabeleleiros: [{
            cabeleleiroId: "cabeleleiroIdFake",
            nome: "nomeFake",
            description: "descriptionFake"
        }]
    }
}

beforeEach(() => {
    vi.resetAllMocks()
    vi.mock("../../lib/prisma", ()=> ({
        prisma: {
            dias: {
                findMany: vi.fn()
            }
        }
    }))

    vi.mock("../days/verifyDayHour", ()=> ({
        verifyDayHour: vi.fn()
    }))
})
  
describe("Filtro de dias dos cabeleleiro pelo horario escolhido", ()=> {
    it("Deve ser possivel filtrar os cabeleleiros", async ()=> {
        vi.mocked(prisma.dias.findMany).mockResolvedValue(schedulesFake) 
        vi.mocked(verifyDayHour).mockResolvedValue(true)
        const result = await filterHairDresserDayByHour(dataExpected)
      
        expect(result).toEqual([expect.objectContaining(scheduleFormatedFake)])
    })
    it("Não deve ser possivel filtrar os cabeleleiros", async ()=> {
        vi.mocked(prisma.dias.findMany).mockResolvedValue([])
        await expect(filterHairDresserDayByHour(dataExpected))
        .rejects
        .toThrow("Horario não encontrado")
    })
})