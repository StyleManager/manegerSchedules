import dayjs from "dayjs";
import {prisma} from "../lib/prisma";
import { verifySundayHoliday } from "./verifySundayHoliday";

export async function PostDays(){
    const date = new Date();
    const day = dayjs(date);
      
    for(let i = 0; i < 7; i++){
        const newDate = dayjs(day).add(i, 'day').startOf('day').toDate();
       
        const checkDay = verifySundayHoliday(newDate);
        if(checkDay) { continue }

        const resultado = await prisma.dias.findUnique({
            where: {
                day: newDate
            }
        })

        if(!resultado){
            const createdDay = await prisma.dias.create({
                data: {
                    day: newDate,
                }
            })

            for(let j = 0; j < 8; j++){
                const horario = `${9 + j}:00`;
                const createdHorario = await prisma.horarios.create({
                    data: {
                        horario: horario,
                        livre: true
                    }
                })

                const diaHorario = await prisma.dias_has_Horarios.create({
                    data: {
                        dayId: createdDay.id,
                        horarioId: createdHorario.id
                    }
                })

                const cabeleleiros = await prisma.cabeleleiros.findMany();
                for(const cabeleleiro of cabeleleiros) {
                    const cabeleleiro_has_disponibilidade = await prisma.cabeleleiro_has_Disponibilidade.create({
                        data: {
                            cabeleleiroId: cabeleleiro.id,
                            diasHorariosId: diaHorario.id
                        }
                    })
                }

                console.log(`Horário criado: ${horario} para o dia ${createdDay.day}`);
            }
        }
    }       
}