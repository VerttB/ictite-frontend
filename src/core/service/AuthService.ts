import { Token } from "../interface/Token";
import { User } from "../interface/User";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const login =  async (user: Pick<User, "username" | "password">) => {
    try{
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if(!response.ok){
            throw new Error(`Erro ao fazer login: ${response.statusText}`);
        }

        const data = await response.json();
        return data

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
}

export const me = async (): Promise<User> => {
  
        
        const response = await fetch(`${baseUrl}/auth/me`, {
            method: "GET",
            credentials: "include",
        });

        if(!response.ok){
            throw new Error(`Erro ao obter dados do usuário: ${response.statusText}`);
        }
        const userData: User = await response.json();
        return userData;
   
    }

export const logout = async () => {
    try{
        const response = await fetch(`${baseUrl}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        if(!response.ok){
            throw new Error(`Erro ao fazer logout: ${response.statusText}`);
        }

    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        throw error;
    }
}