import dayjs from "dayjs";

export function verifyDayHour(day: string, hour: string){

    const nowDate = dayjs()
    const ano = dayjs().year()

    if(day.includes("/")){
        const [dia, mes] = day.split("/") 
        const dataCompleta = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}T${hour}`
        const agendamento = dayjs(dataCompleta)
        return dayjs(agendamento).isAfter(nowDate.add(1, 'hour'))
    } else {
        const agendamento = dayjs(`${day}T${hour}`);
        return dayjs(agendamento).isAfter(nowDate.add(1, 'hour'))
    }
}