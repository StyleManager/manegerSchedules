import { FastifyTypedInstance } from "../../types/fastifyTyped";
import z from "zod";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import {env} from "../../env";
import { AuthService } from "../../services/authServices";
import { handleLogin } from "../../functions/users/handleLogin";

export function GetUser(server: FastifyTypedInstance){
    server.post("/login", {
        schema: {
            body: z.object({
                email: z.string().email(),
                senha: z.string(),
            }),
            response: {
                201: z.object({
                    acessToken: z.string(),
                }).describe("Token gerado com sucesso!"),
                401: z.object({
                    error: z.string(),
                }).describe("Credenciais Invalidas"),
                404: z.object({
                    erro: z.string(),
                }).describe("Usuario não encontrado!"),
                500: z.object({
                    error: z.string(),
                }).describe("Erro interno do servidor")
            }
        }
    }, async (request, reply) => {
        try { 

            const authenticate = new AuthService(server.jwt)
            const {email, senha} = request.body;
            const user = await prisma.clientes.findUnique({where: {
                email: email
            }})

            if (!user) return reply.status(404).send({ erro: "Usuario não encontrado!" })

            const {acessToken, refreshToken} = await handleLogin({email, senha}, server.jwt)

            reply.setCookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 7
            })

            return reply.status(201).send({acessToken})
        } catch (error) {
            console.log(error)
            return reply.status(500).send({error: "Erro interno do servidor"})
        }
    })
}


// import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
// import z from "zod";

// export const LogoutUser: FastifyPluginAsyncZod = async (server) => {
//     server.post("/user/logout", {
//         schema: {
//             tags: ["User", "Login"],
//             summary: "Log-out cliente",
//             description: "Apagar o cookie de acesso",
//             response: {
//                 200: z.object({
//                     message: z.string()
//                 })
//             }
//         }
//     }, async (request, reply) => {

//         reply.setCookie("userId", "", {
//             httpOnly: true,
//             sameSite: true,
//             path: "/",
//             maxAge: 0,
//         })

//         return reply.status(200).send({
//             message: 'Logout feito com sucesso'
//         })
//     })
// }