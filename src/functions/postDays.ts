import dayjs from "dayjs";
import {prisma} from "../lib/prisma";

export async function PostDays(){
    const date = new Date();
    const day = dayjs(date);

    for(let i = 0; i < 7; i++){
        const newDate = dayjs(day).add(i, 'day').startOf('day').toDate();
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
                await prisma.horarios.create({
                    data: {
                        horario,
                        dayId: createdDay.id,
                        livre: true
                    }
                })
                console.log(`Horário criado: ${horario} para o dia ${createdDay.day}`);
            }
        }
    }       
}