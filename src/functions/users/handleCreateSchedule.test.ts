import {it, expect, describe, vi} from "vitest"
import {prisma} from "../../lib/prisma"
import { filterHourDay } from "../filters/filterDayHour"
import { handleCreateSchedule } from "./handleCreateSchedule"

vi.mock("../../lib/prisma", ()=> ({
    prisma: {
        servicos: {
            findUnique: vi.fn()
        },
        agendamentos: {
            create: vi.fn()
        },
        horarios: {
            update: vi.fn()
        }
    }
}))

vi.mock("../filters/filterDayHour", ()=> ({
    filterHourDay: vi.fn()
}))

const agendamentoFake = {         
    servicosId: "servicoIdFake", 
    clientId: "userIdFake",      
    cabeleleiroId: "cabeleleiroIdFake",
    diasHorariosId: "diaHorarioIdFake",
    confirmado: true
}

const dataExpected = {
    diaHorarioId: "diaHorarioIdFake",
    userId: "userIdFake",
    servicoId: "servicoIdFake"
}

const serviceFake = {
    id: "1",
    tipoServicoId: "tipoServicoIdFake",
    cabeleleiroId: "cabeleleiroIdFake"
}

const dia_has_horarioFake = {
    id: "1",
    dayId: "dayIdFake",
    horarioId: "horarioIdFake"
}

const horarioUpdatedFake = {
    id: "1",
    livre: true,
    horario: "horarioFake"
}

describe("Criação de agendamento", ()=> {
    it("Deve ser possivel criar o agendamento", async ()=> {
        vi.mocked(prisma.servicos.findUnique).mockResolvedValue(serviceFake)
        vi.mocked(filterHourDay).mockResolvedValue(dia_has_horarioFake)
        vi.mocked(prisma.horarios.update).mockResolvedValue(horarioUpdatedFake)
        vi.mocked(prisma.agendamentos.create).mockResolvedValue({
            id: "1",
            ...agendamentoFake
        })

        const result = await handleCreateSchedule(dataExpected)
        expect(result).toMatchObject({
            id: "1",
            ...agendamentoFake
        })

    })
    it("Não deve ser possivel a criação! Servico não foi encontrado!", async ()=> {
        vi.mocked(prisma.servicos.findUnique).mockResolvedValue(null)

        await expect(handleCreateSchedule(dataExpected))
        .rejects
        .toThrow("Servico não encontrado, ocorreu algum erro ao fazer o agendamento")
    })
})