import {expect, it, describe} from "vitest"
import { verifyDay } from "./verifyDay"
import dayjs from "dayjs"

describe("Verifica se a data é valida", ()=> {
    const day = String(dayjs(new Date()).add(1, 'day'))
    it("Deve retornar true", ()=> {
        expect(verifyDay(day)).toBe(true)
    })
})
describe("Verifica se a data é valida", ()=> {
    const day = String(dayjs(new Date()).add(-1, 'day'))
    it("Deve retornar true", ()=> {
        expect(verifyDay(day)).toBe(false)
    })
})