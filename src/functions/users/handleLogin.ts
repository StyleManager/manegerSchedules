import { AuthService } from "../../services/authServices"

export async function handleLogin({email, senha}: { email: string, senha: string }, jwt: any){
    if(!email || !senha) throw new Error("Campos obrigatorios não preenchidos corretamente!")
    
    const authService = new AuthService(jwt);
    return authService.login(email, senha);
}