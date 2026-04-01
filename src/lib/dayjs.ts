import dayjs from "dayjs";
import Holidays from "date-holidays";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("America/Sao_Paulo");

export default dayjs;;