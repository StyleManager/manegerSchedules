import {describe, it, vi, expect, beforeEach} from "vitest"
import { prisma } from "../../lib/prisma"
import { verifyDay } from "../days/verifyDay"
import {filterSchedulesByHour  } from "./filterSchedulesByHour";
import dayjs from "dayjs";

const schedulesFake = [
    {
        id: "idFake",
        day: new Date(), 
        Dias_has_Horarios: [
        {
            horario: {
            id: "diaIdFake",
            horario: "horarioFake",
            livre: true,
            diaHorarioId: "diaHorarioIdFake"
            },
            cabeleleiro_has_Disponibilidade: [
            {
                cabeleleiroId: "cabeleleiroIdFake",
                cabeleleiro: {
                id: "cabeleleiroIdFake",
                nome: "nomeFake",
                description: "descriptionFake"
                }
            }
            ]
        }
        ]
    }
]

const data = [
    {
        horario: "horarioFake",
        dia: dayjs(new Date()).format("DD/MM"),
        diaId: "idFake",
        cabeleleiros: [
        {
          cabeleleiroId: "cabeleleiroIdFake",
          nome: "nomeFake",
          description: "descriptionFake"
        }
      ]
    }
]

beforeEach(() => {
    vi.resetAllMocks()

    vi.mock("../../lib/prisma", ()=> ({
        prisma: {
            dias: {
                findMany: vi.fn()
            }
        }
    }))

    vi.mock("../days/verifyDay", ()=> ({
        verifyDay: vi.fn()
    }))
})

describe("Filtro de agendas pelo horario, retorna os dias", () => {
    it("Deve retornar os dias", async ()=> {
        vi.mocked(prisma.dias.findMany).mockResolvedValue(schedulesFake)
        vi.mocked(verifyDay).mockResolvedValue(true)

        const result = await filterSchedulesByHour({hour: "horarioFake"})
        expect(result).toEqual(expect.arrayContaining([expect.objectContaining(data[0])]))
    })
    it("Não Deve retornar os dias | horarios  não encontrado no banco", async ()=> {
        vi.mocked(prisma.dias.findMany).mockResolvedValue([])

        await expect(filterSchedulesByHour({hour: "horarioFake"}))
        .rejects
        .toThrow("Horario não disponivel para agendamento!")
    })
})