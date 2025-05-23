import { AuthService } from "../../services/authServices"

export async function handleLogin({email, senha}: { email: string, senha: string }, jwt: any){
    const authService = new AuthService(jwt);
    return authService.login(email, senha);
}