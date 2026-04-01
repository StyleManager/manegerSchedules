import dayjs from "../../lib/dayjs"
import { it, describe, vi, expect } from "vitest"
import { verifySundayHoliday } from "./verifySundayHoliday"

const newDate = dayjs().toDate()

const getSundayFake = (date: Date) => {
    let currentDay = dayjs(date)
    for (var i = 0; i <= 8; i++) {
        if (currentDay.day() === 0) {
            break;
        }
        currentDay = dayjs().add(i, "day")
    }
    return currentDay
}

const getValiteddDayFake = (date: Date) => {
    let currentDay = dayjs(date)
    for (var i = 0; i <= 8; i++) {
        if (currentDay.day() != 0) {
            break;
        }
        currentDay = dayjs().add(i, "day")
    }
    return currentDay
}

describe("Verifica se o dia é um feriado ou domingo", () => {
    it("deve retornar true para domingos", () => {
        const sunday = getSundayFake(dayjs().toDate())
        console.log(dayjs(sunday).format("DD/MM/YYYY"))

        const result = verifySundayHoliday(dayjs(sunday).toDate())
        expect(result).toBe(true)
    })

    it("deve retornar true, pois o dia é valido", () => {
        const day = getValiteddDayFake(dayjs().toDate())
        const result = verifySundayHoliday(dayjs(day).toDate())
        expect(result).toBe(false)
    })
})