import {describe, it, vi, expect, beforeEach} from "vitest"
import { prisma } from "../../lib/prisma"
import { verifyDayHour } from "../days/verifyDayHour";
import dayjs from "dayjs";
import { filterSchedulesByDay } from "./filterSchedulesByDay";

const schedulesFake = 
{
    id: "idFake",
    day: new Date("2025-05-26T12:00:00Z"), 
    Dias_has_Horarios: [
      {
        horario: {
          id: "idFake",
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

const data = [
    {
      horario: {
        id: "idFake",
        horario: "horarioFake",
        livre: true,
        diaHorarioId: "diaHorarioIdFake"
      },
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
                findFirst: vi.fn()
            }
        }
    }))

    vi.mock("../days/verifyDayHour", ()=> ({
        verifyDayHour: vi.fn()
    }))
})

describe("Filtro de agendas pelo dia, retorna os horarios", () => {
    it("Deve retornar os horarios", async ()=> {
        vi.mocked(prisma.dias.findFirst).mockResolvedValue(schedulesFake)
        vi.mocked(verifyDayHour).mockResolvedValue(true)

        const result = await filterSchedulesByDay({day: "dayFake"})
        expect(result).toEqual(expect.arrayContaining([expect.objectContaining(data[0])]))
    })
    it("Não Deve retornar os horarios | Horario  não encontrado no banco", async ()=> {
        vi.mocked(prisma.dias.findFirst).mockResolvedValue(null)

        await expect(filterSchedulesByDay({day: "dayFake"}))
        .rejects
        .toThrow("Horario não disponivel para agendamento!")
    })
    it("Deve retornar os horarios | data vazio", async ()=> {
        vi.mocked(prisma.dias.findFirst).mockResolvedValue({
            id: "idFake",
            day: new Date("2025-05-26T12:00:00Z"), 
            Dias_has_Horarios: [
                {
                    horario: {
                    id: "idFake",
                    horario: "horarioFake",
                    livre: true,
                    diaHorarioId: "diaHorarioIdFake"
                    },
                    cabeleleiro_has_Disponibilidade: []
                }
            ]
        } as any)
        vi.mocked(verifyDayHour).mockResolvedValue(false)

        await expect(filterSchedulesByDay({day: "dayFake"}))
        .rejects
        .toThrow("Não há horarios disponiveis para este dia")
        
    })
})