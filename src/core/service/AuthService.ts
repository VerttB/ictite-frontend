import { Token } from "../interface/Token";
import { User } from "../interface/User";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const login =  async (user: Pick<User, "username" | "password">) => {
    console.log(baseUrl)
    try{
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if(!response.ok){
            throw new Error(`Erro ao fazer login: ${response.statusText}`);
        }

        const data = await response.json();
        const token: Token = {
            accessToken: data.access_token,
            tokenType: data.token_type
        }
        return token;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
}

export const me = async (): Promise<User> => {
  
        
        const response = await fetch(`${baseUrl}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        const userData: User = await response.json();
        return userData;
   
    }
