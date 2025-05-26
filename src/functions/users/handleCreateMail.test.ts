import {describe, it, vi, expect, beforeEach} from "vitest"
import { getMailCLient } from "../../lib/mails";
import { filterHourDay } from "../filters/filterDayHour";
import { filterHourFree } from "../filters/filterHourFree";
import { handleCreateMail } from "./handleCreateMail";

vi.mock("../filters/filterDayHour")
vi.mock("../filters/filterHourFree")
vi.mock("../../lib/mails", ()=> ({
    getMailCLient: vi.fn(() => ({
        sendMail: vi.fn()
    }))
}))

const dia_has_horarioFake = {
    id: "1",
    dayId: "dayIdFake",
    horarioId: "horarioIdFake"
}

const horarioLivreFake = {
    id: "idFake",
    horario: "horarioFake",
    livre: true,
}

const handleCreateEmailDataFake = {
    confirmatedLink: "confirmatedLinkFake",
    destinary_email: "destinary_emailFake",
    destinary_name: "destinary_nameFake",
    date: "dateFake",
    dayHorarioId: "dayHorarioIdFake",
}

const expectSendMailCall = {
    from: {
            name: "Equipe de atendimento",
            address: "atendimento@teste.com"
        },
        to: {
            name: "destinary_nameFake",
            address: "destinary_emailFake",
        },
        subject: `Email de confirmação do agendamento do dia ${"dateFake"} às ${"horarioFake"}`,
        html: `
                <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                <p>Você pré-agendou um corte de cabelo para o dia <strong>${"dateFake"}</strong>, às <strong>${"horarioFake"}.</strong></p>                      
                <p>Para confirmar seu corte, clique no link abaixo:</p>
                <p><a href="${"confirmatedLinkFake"}">Confirmar agendamento</a></p>
                <p>Caso você não saiba do que se trata esse e-mail, apenas ignore ele.</p>
            </div>
        `.trim()
}

beforeEach(()=> {
    vi.clearAllMocks()
    vi.mocked(filterHourDay).mockResolvedValue(dia_has_horarioFake)
    vi.mocked(filterHourFree).mockResolvedValue(horarioLivreFake)
})

describe("Envio de email", () => {
    it("Deve ser possivel enviar o email!", async ()=> {  
        const result = await handleCreateMail(handleCreateEmailDataFake)

        expect(getMailCLient).toHaveBeenCalledTimes(1)
        const mockMailClient = vi.mocked(getMailCLient).mock.results[0].value
        expect(mockMailClient.sendMail).toHaveBeenCalledTimes(1);
        expect(mockMailClient.sendMail).toHaveBeenCalledWith(expect.objectContaining(expectSendMailCall))
    })
})
    
