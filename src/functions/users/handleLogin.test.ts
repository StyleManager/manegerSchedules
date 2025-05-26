import { AuthService } from "../../services/authServices";
import {vi, describe, it, expect} from "vitest"
import { FastifyInstance } from "fastify";
import { handleLogin } from "./handleLogin";

const userFake = {
    email: "emailFake@gmail.com",
    senha: "senhaFake123"
}

vi.mock("../../services/authServices", ()=> ({
    AuthService: vi.fn().mockImplementation(() => ({
        login: vi.fn().mockResolvedValue({acessToken: "accestoknFake",  refreshToken: "accestoknFake"})
    }))
}))

describe("Testes do handleLogin", ()=> {
    it("Deve ser possivel chamar o AuthService", async ()=> {
        const result = await handleLogin(userFake, {})

        expect(AuthService).toHaveBeenCalled()
        expect(result).toEqual({acessToken: "accestoknFake", refreshToken: "accestoknFake"})
    })

    describe.each([
        {email: "", senha: userFake.senha, desc: "email vazio"},
        {email: userFake.email, senha: "", desc: "senha vazia"},
        {email: "", senha: "", desc: "email e senha vazios"}
    ])("Handle login com input invalido ($desc)", ({email, senha, desc}) => {
        it(`deve falhar quando ${desc}})`, async () => {
            await expect(handleLogin({email, senha}, {}))
            .rejects
            .toThrow("Campos obrigatorios não preenchidos corretamente!")
        })
    })
    describe.each([
        {email: null, senha: userFake.senha, desc: "email nulo"},
        {email: userFake.email, senha: null, desc: "senha nula"},
        {email: null, senha: null, desc: "email e senha nulos"}
    ])("Handle login com input invalido ($desc)", ({email, senha, desc}) => {
        it(`deve falhar quando ${desc}})`, async () => {
            await expect(handleLogin({email, senha} as any, {}))
            .rejects
            .toThrow("Campos obrigatorios não preenchidos corretamente!")
        })
    })
})