    import { prisma } from "../lib/prisma";
    import { FastifyTypedInstance } from "../types/fastifyTyped";
    import z from "zod";

    export function GetSchedules(server: FastifyTypedInstance){
        server.get("/horarios", {
            schema: {
                description: "Horarios de atendimento",
                response: {
                    200: z.array(
                        z.object({
                            id: z.string(),
                            day: z.string(),
                            horarios: z.array(
                                z.object({
                                    id: z.string(),
                                    horario: z.string(),
                                    livre: z.boolean()
                                })
                            )
                        })
                    ),
                    500: z.object({
                        error: z.string()
                    })
                }
            }
        }, async (request, reply) => {
            try {
                const dias = await prisma.dias.findMany({
                    include:{
                        Horarios: true,
                    },
                    orderBy: {
                        day: "asc",
                    },
                });
                const agenda = dias.map((dias) => ({
                    id: dias.id,
                    day: dias.day.toISOString(),
                    horarios: dias.Horarios.map(horario => ({
                        id: horario.id,
                        horario: horario.horario,
                        livre: horario.livre
                    }))
                }))
                return reply.status(200).send(agenda);
            } 
            catch (error) {
                return reply.status(500).send({error: "Ocorreu um erro ao buscar os dias!"});
            }
        })
    }
