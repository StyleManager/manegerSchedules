import {it, describe, expect, vi, beforeEach} from "vitest"
import {prisma}  from "../../lib/prisma"
import { handlerCreateUser } from "./handleCreateUser"
import bcrypt from "bcrypt"

const fakerUser = {
    name: "fakerName",
    email: "fakerEmail@gmail.com",
    senha: "fakerSenha123"
}

vi.mock("../../lib/prisma", ()=> ({
    prisma: {
        clientes: {
            findUnique: vi.fn(),
            create: vi.fn()
        }
    } 
}))

vi.mock("bcrypt", ()=> ({
    default: {
        hash: vi.fn()
    }
}))
     
describe("Create user", ()=> {

    beforeEach(() => {
        vi.clearAllMocks(); 
    });

    it("Deve ser possivel criar o usuario! e o retorno deve ser os seus dados", async () => {
        vi.mocked(prisma.clientes.findUnique).mockResolvedValue(null)
        
        const fakeHashedPassword = "hashed_senha123"
        vi.mocked(bcrypt.hash).mockImplementation(() => Promise.resolve(fakeHashedPassword))
        vi.mocked(prisma.clientes.create).mockResolvedValue({
            id: "1",
            ...fakerUser,
            senha: fakeHashedPassword
        })

        const result = await handlerCreateUser(fakerUser)
        expect(result).toMatchObject({
            id: "1",
            name: "fakerName",
            email: "fakerEmail@gmail.com",
            senha: fakeHashedPassword
        })
    })
    it("Não Deve ser possivel criar o usuario, caso o email já esteja sendo utilizado", async ()=> {
        vi.mocked(prisma.clientes.findUnique).mockResolvedValue({
            id: "1",
            ...fakerUser,
            senha: "hashedPassword"
        })

        await expect(handlerCreateUser(fakerUser))
        .rejects
        .toThrow("Esse email já está sendo utilizado!")

        expect(prisma.clientes.create).not.toHaveBeenCalled()
    })
})