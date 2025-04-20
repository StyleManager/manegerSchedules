import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import { getMailCLient } from "../../lib/mails";
import nodemailer from "nodemailer";
import { prisma } from "../../lib/prisma"
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
import { Authenticate } from "../../middleware/authenticator";

export function PostSchedules(server: FastifyTypedInstance){
    server.withTypeProvider<ZodTypeProvider>().post("/schedule",{
        preHandler: Authenticate,
        schema: {
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

            const data = await prisma.dias_has_Horarios.findUnique({  where: { id: dayHorarioId} })
            if(!data){ return reply.status(401).send("Dia invalido ou já lotado!");}
            
            const horarioLivre = await prisma.horarios.findUnique({
                where: {
                    id: data.horarioId,
                    livre: true,
                }
            })
            if(!horarioLivre){ return reply.status(401).send("Erro ao tentar agendar horario!");}

            const day = await prisma.dias.findUnique({ where: { id: data.dayId, }})
            if(!day){ return reply.status(401).send("Erro ao tentar agendar horario!");}

            const servico = await prisma.servicos.create({
                data: {
                    tipoServicoId,
                    cabeleleiroId,
                }
            })

            const date = dayjs(day.day).format("DD/MM");
            const confirmatedLink = `http://localhost:3333/schedules/confirmation/${data.id}/${sub}/${servico.id}`;

            const mail = await getMailCLient();
            const message = await mail.sendMail({
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

            return reply.status(201).send({
                message: `Email enviado com sucesso para o email ${destinary_email} do(a) ${destinary_name}`,
                email: nodemailer.getTestMessageUrl(message)
            });
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return reply.status(500).send({error: "Erro interno do servidor"});
        }   
    })
}