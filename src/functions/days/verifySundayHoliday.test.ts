// import dayjs from "dayjs";
// import Holidays from "date-holidays";

// export function verifySundayHoliday(newDate: Date){
//     const hd = new Holidays('BR')

//     const currentDay = dayjs(newDate);
//     const sunday = currentDay.day() === 0

//     if (hd.isHoliday(newDate)) {
//         const holiday = hd.getHolidays(newDate.getFullYear());
//         const holidayOnThisDate = holiday.find(h => dayjs(h.date).isSame(newDate, 'day'));

//         if (!holidayOnThisDate) { throw new Error("Ocorreu algum erro ao identificar o feriado!")}
//         console.log(`Dia: ${newDate} é feriado: ${holidayOnThisDate.name}`);
//         return true;
//     }

//     if (sunday) {
//         console.log(`Dia: ${newDate} é domingo`); 
//         return true;
//     }

//     return false;
// }

import dayjs from "dayjs"
import {it, describe, vi, expect} from "vitest"
import { verifySundayHoliday } from "./verifySundayHoliday"

const newDate = dayjs().toDate()

const getSundayFake = (date: Date) => {
    let currentDay = dayjs(date)
    for(var i = 0; i <= 8 ;i++) {
        if(currentDay.day() === 0){
            break;
        }
        currentDay = dayjs().add(i, "day")
    }   
    return currentDay
}

const getValiteddDayFake = (date: Date) => {
    let currentDay = dayjs(date)
    for(var i = 0; i <= 8 ;i++) {
        if(currentDay.day() != 0){
            break;
        }
        currentDay = dayjs().add(i, "day")
    }   
    return currentDay
}

describe("Verifica se o dia é um feriado ou domingo", ()=> {
    it("deve retornar true para domingos", ()=> {
        const sunday = getSundayFake(dayjs().toDate())
        console.log(dayjs(sunday).format("DD/MM/YYYY"))

        const result = verifySundayHoliday(dayjs(sunday).toDate())
        expect(result).toBe(true)
    })

    it("deve retornar true, pois o dia é valido", ()=> {
        const day = getValiteddDayFake(dayjs().toDate())
        const result = verifySundayHoliday(dayjs(day).toDate())
        expect(result).toBe(false)
    })
})