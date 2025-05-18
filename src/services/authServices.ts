import { FastifyInstance } from "fastify";
import {prisma} from "../lib/prisma"
import bcrypt from "bcrypt";

export class AuthService {
    constructor(private jwt: FastifyInstance["jwt"]){}

    async login(email: string, senha: string){
        const user = await prisma.clientes.findUnique({where: { email}})
        if(!user) {throw new Error("Usuario não encontrado!")}

        const senhaValidada = await bcrypt.compare(senha, user.senha);
        if(!senhaValidada) {throw new Error("Senha invalida!")}
        const acessToken = this.jwt.sign({sub: user.id}, {expiresIn: "2h"})
        const refreshToken = this.jwt.sign({sub: user.id}, {expiresIn: "7d"})
        
        return {acessToken, refreshToken}
    }

    refreshToken(token: string){
        const payload = this.jwt.verify(token) satisfies {sub: string}
        if(!payload) {throw new Error("Token invalido!")}
        const acessToken = this.jwt.sign({sub: payload.sub}, {expiresIn: "15min"})

        return {acessToken}
    }
}