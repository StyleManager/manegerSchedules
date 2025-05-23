import dayjs from "dayjs";
import Holidays from "date-holidays";

export function verifySundayHoliday(newDate: Date){
    const hd = new Holidays('BR')

    const currentDay = dayjs(newDate);
    const sunday = currentDay.day() === 0

    if (hd.isHoliday(newDate)) {
        const holiday = hd.getHolidays(newDate.getFullYear());
        const holidayOnThisDate = holiday.find(h => dayjs(h.date).isSame(newDate, 'day'));

        if (!holidayOnThisDate) { throw new Error("Ocorreu algum erro ao identificar o feriado!")}
        console.log(`Dia: ${newDate} é feriado: ${holidayOnThisDate.name}`);
        return true;
    }

    if (sunday) {
        console.log(`Dia: ${newDate} é domingo`); 
        return true;
    }

    return false;
}