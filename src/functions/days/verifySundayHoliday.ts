import dayjs from "../../lib/dayjs";
import Holidays from "date-holidays";

export function verifySundayHoliday(newDate: Date) {
    try {
        const hd = new Holidays('BR');

        const sunday = dayjs(newDate).day() === 0;

        const holiday = hd.isHoliday(newDate);

        if (holiday) {
            console.log(`Dia: ${newDate} é feriado: ${holiday[0].name}`);
            return true;
        }

        if (sunday) {
            console.log(`Dia: ${newDate} é domingo`);
            return true;
        }

        return false;
    } catch (error) {
        console.error("Erro ao identificar feriado/domingo:", error);
        return false;
    }
}