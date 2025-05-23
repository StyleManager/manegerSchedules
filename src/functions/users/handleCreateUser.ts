import { prisma } from "../../lib/prisma"
import bcrypt from "bcrypt"

export async function handlerCreateUser({name, email, senha} : {
    name: string,
    email: string,
    senha: string
}) {
    const existUser = await prisma.clientes.findUnique({ where: { email } })             
    if(existUser){ throw new Error("Esse email já está sendo utilizado!") }

    const hasedPassword = await bcrypt.hash(senha, 10);
    return await prisma.clientes.create({
        data: {
            name,
            email,
            senha: hasedPassword
        }
    })
}