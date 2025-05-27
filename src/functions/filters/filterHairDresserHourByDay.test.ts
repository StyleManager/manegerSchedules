import { prisma } from "../../lib/prisma";
import {vi, describe, it, expect, beforeEach} from "vitest"
import { filterHairDresserHourByDay } from "../../functions/filters/filterHairDresserHourByDay";
import dayjs from "dayjs";

vi.mock("../../lib/prisma", ()=> ({
    prisma: {
        dias: {
            findFirst: vi.fn()
        }
    }
}))

const dataExpected = {
    day: "dayFake",
    cabeleleiroId: "cabeleleiroIdFake"
}

const schedulesFake = {
    id: "idFake",
    day: new Date(),
    Dias_has_Horarios: [
        {
            id: "idFake",
            day: new Date(),
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

describe("Filtro de dias dos cabeleleiro pelo horario escolhido", ()=> {
    it("Deve ser possivel filtrar os cabeleleiros", async ()=> {
        vi.mocked(prisma.dias.findFirst).mockResolvedValue(schedulesFake)
        const result = await filterHairDresserHourByDay(dataExpected)
      
        expect(result[0]).toEqual(expect.objectContaining(scheduleFormatedFake))
    })
})