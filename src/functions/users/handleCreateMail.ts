import { getMailCLient } from "../../lib/mails";
import { prisma } from "../../lib/prisma";
import { filterDay } from "../filters/filterDay";
import { filterHourDay } from "../filters/filterDayHour";
import { filterHourFree } from "../filters/filterHourFree";

export async function handleCreateMail({confirmatedLink, destinary_email, destinary_name, date, dayHorarioId}: {
    confirmatedLink: string,
    destinary_email: string,
    destinary_name: string,
    date: string,
    dayHorarioId: string,
}){

    const data = await filterHourDay(dayHorarioId);
    const horarioLivre = await filterHourFree(data.horarioId)

    const mail = await getMailCLient();
    return await mail.sendMail({
        from: {
            name: "Equipe de atendimento",
            address: "atendimento@teste.com"
        },
        to: {
            name: destinary_name,
            address: destinary_email,
        },
        subject: `Email de confirmação do agendamento do dia ${date} às ${horarioLivre.horario}`,
        html: `
                <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                <p>Você pré-agendou um corte de cabelo para o dia <strong>${date}</strong>, às <strong>${horarioLivre.horario}.</strong></p>                      
                <p>Para confirmar seu corte, clique no link abaixo:</p>
                <p><a href="${confirmatedLink}">Confirmar agendamento</a></p>
                <p>Caso você não saiba do que se trata esse e-mail, apenas ignore ele.</p>
            </div>
        `.trim()
    });
}