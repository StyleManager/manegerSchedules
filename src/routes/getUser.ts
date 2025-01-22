    import { FastifyTypedInstance } from "../types/fastifyTyped";
    import z from "zod";
    import jwt from "jsonwebtoken";
    import { prisma } from "../lib/prisma";
    import bcrypt from "bcrypt";
    import {env} from "../env";

    export function GetUser(server: FastifyTypedInstance){
        server.post("/login", {
            schema: {
                body: z.object({
                    email: z.string().email(),
                    senha: z.string(),
                }),
                response: {
                    201: z.object({
                        token: z.string(),
                    }).describe("Token gerado com sucesso!"),
                    401: z.object({
                        error: z.string(),
                    }).describe("Credenciais Invalidas"),
                    500: z.object({
                        error: z.string(),
                    }).describe("Erro interno do servidor")
                }
            }
        }, async (request, reply) => {
            try { 
                const {email, senha} = request.body;

                const user = await prisma.clientes.findUnique({ where: { email }})
                if(!user){
                    return reply.status(401).send({error: "Usuario não encontrado!"});
                }

                const senhaCorreta = bcrypt.compare(senha, user.senha);
                if(!senhaCorreta){
                    return reply.status(401).send({error: "Erro interno do servidor"});
                }

                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    env.SECRET_KEY,
                    { expiresIn : "1h" }
                );

                return reply.status(201).send({token})
            } catch (error) {
                return reply.status(500).send({error: "Erro interno do servidor"})
            }
        })
    }