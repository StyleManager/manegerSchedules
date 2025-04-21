import dayjs from "dayjs";

export function verifyDay(day: string){

    const nowDate = dayjs().startOf("day")
    const ano = dayjs().year()

    const agendamento = dayjs(day).startOf("day")
    const agendamentoValido = dayjs(agendamento).isAfter(nowDate) || dayjs(agendamento).isSame(nowDate)

    return agendamentoValido
}