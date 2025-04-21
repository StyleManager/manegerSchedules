import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import bcrypt from "bcrypt";

export function PostUser(server: FastifyTypedInstance){
    server.withTypeProvider<ZodTypeProvider>().post("/cadastrar", {
        schema: {
            body: z.object({
                name: z.string().min(3),
                email: z.string().email(),
                senha: z.string().min(3)
            }),
            description: "Cadastro de usuarios!",
            reponse: {
                201: z.array(
                    z.object({
                        name: z.string(),
                        email: z.string().email(),
                        senha: z.string(),
                    })
                ),
                500: z.object({
                    error: z.string(),
                })
            }
        }
    }, async (request, reply)=> {
        try {
            const {name, email, senha} = request.body;
            const existUser = await prisma.clientes.findUnique({ where: { email } })
                                
            if(existUser){ return reply.status(401).send({message: "Esse email já está sendo utilizado!"}) }

                const hasedPassword = await bcrypt.hash(senha, 10);
                const user = await prisma.clientes.create({
                    data: {
                        name,
                        email,
                        senha: hasedPassword
                    }
                })

                const {senha:_, id:__, ...formatedUser} = user

                return reply.status(201).send(formatedUser);
           
        } catch(error) {
            return reply.status(500).send({error: "Ocorreu um erro inesperado!"})
        }
    })
}