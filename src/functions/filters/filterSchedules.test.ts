import {describe, vi, it, expect} from "vitest"
import { prisma } from "../../lib/prisma"
import { filterSchedules } from "./filterSchedules"
import dayjs from "dayjs"
import { verifyDayHour } from "../days/verifyDayHour"

vi.mock("../../lib/prisma", ()=> ({
    prisma: {
        dias: {
            findMany: vi.fn()
        }
    }
}))

vi.mock("../days/verifyDayHour", () => ({
    verifyDayHour: vi.fn()
}))

const schedulesFake = [
  {
    id: "idFake",
    day: new Date(), 
    Dias_has_Horarios: [
      {
        id: "diaHorarioIdFake", 
        horario: {
          id: "idFake",
          horario: "horarioFake",
          livre: true
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

const schedulesFormattedFake = {
  id: "idFake",
  day: dayjs(new Date()).format("DD/MM"),
  horarios: [
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
}

describe("filtro de agendamentos disponiveis", ()=> {
    it("Deve retornar os horarios livres", async ()=> {
        vi.mocked(prisma.dias.findMany).mockResolvedValue(schedulesFake as any)
        vi.mocked(verifyDayHour).mockRejectedValue(true)

        const result = await filterSchedules()
        expect(result).toEqual(expect.arrayContaining([expect.objectContaining(schedulesFormattedFake)]))
        
    })
})