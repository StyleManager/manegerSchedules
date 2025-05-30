import dayjs from "dayjs";
import { expect, it, describe} from "vitest"
import { verifyDayHour } from "./verifyDayHour"
import utc from 'dayjs/plugin/utc'; 
import timezone from 'dayjs/plugin/timezone'; 

const verifySundayHoliday = (date: string) => {
    const dayOfWeek = dayjs(date).day();
    return true; 
}

dayjs.extend(utc);
dayjs.extend(timezone);
const horarioBr = dayjs().tz('America/Sao_Paulo');
const hora24 = horarioBr.format('HH:mm');

let targetDay = dayjs().add(1, "day")
while(!verifySundayHoliday(String(targetDay.toDate))) {
    if(targetDay.diff(dayjs(), "day") > 7){
        console.error("Could not find a valid day within 7 days.");
        targetDay = dayjs().add(1, 'day'); 
        break;
    }
}

const data = {
    day: targetDay.format("DD/MM/YYYY"),
    hour: "11:00"
}

describe("Verifica se a data é valida", ()=> {
    it("Deve retornar true para data 1 dia no futuro", ()=> {
        expect(verifyDayHour(data.day, data.hour)).toBe(true)
    })
    it("Deve retornar false para data no passado", ()=> {
        let dataAtPast = String(dayjs(data.day).subtract(1, "day"))
        expect(verifyDayHour(dataAtPast, data.hour)).toBe(false)
    })
})
