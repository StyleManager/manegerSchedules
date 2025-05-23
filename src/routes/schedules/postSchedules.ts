import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import nodemailer from "nodemailer";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
import { Authenticate } from "../../middleware/authenticator";
import { verifyDayHour } from "../../functions/days/verifyDayHour";
import { handleCreateService } from "../../functions/users/handleCreateService";
import { handleCreateMail } from "../../functions/users/handleCreateMail";
import { filterHourDay } from "../../functions/filters/filterDayHour";
import { filterHour } from "../../functions/filters/filterHour";
import { filterDay } from "../../functions/filters/filterDay";

export function PostSchedules(server: FastifyTypedInstance){
    server.withTypeProvider<ZodTypeProvider>().post("/schedule",{
        preHandler: Authenticate,
        schema: {
            description: "Envia um email de confirmação do agendamento",
            body: z.object({
                destinary_name: z.string(),
                destinary_email: z.string().email(),
                dayHorarioId: z.string().uuid(),
                cabeleleiroId: z.string(),
                tipoServicoId: z.string(),
            }),
        }
    }, async (request, reply)=> {
        try {
            const sub = request.user.sub;
            const {destinary_name, destinary_email, dayHorarioId, tipoServicoId, cabeleleiroId} = request.body;

            const servico = await handleCreateService({tipoServicoId, cabeleleiroId})
            const hourDayID = await filterHourDay(dayHorarioId);
            const hour = await filterHour(hourDayID.horarioId);
            const day = await filterDay(hourDayID.dayId);

            const date = dayjs(day.day).format("DD/MM");
            const scheduleChecked = verifyDayHour(date, hour.horario)
            if(!scheduleChecked) {return reply.status(401).send({message: "Você precisa agendar com 2 horas de antecedencia"})}

            const confirmatedLink = `http://localhost:3333/schedules/confirmation/${hourDayID.id}/${sub}/${servico.id}`;
            const message = await handleCreateMail({confirmatedLink, destinary_email, destinary_name, date, dayHorarioId})
           
            return reply.status(201).send({
                message: `Email enviado com sucesso para o email ${destinary_email} do(a) ${destinary_name}`,
                email: nodemailer.getTestMessageUrl(message)
            });
        } catch (error) {
            return reply.status(500).send({error: "Erro interno do servidor"});
        }   
    })
}