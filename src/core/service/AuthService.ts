import { UserLogin } from "@/core/domain/User";
import { User } from "@/core/domain/User";
import { apiClient } from "@/lib/api/client";

export const login = async (loginRequest: UserLogin) => {
    return await apiClient.post("/auth/login/", loginRequest);
};

export const me = async (): Promise<User> => {
    const userData = await apiClient.get<User>("/auth/me/");
    if (!userData) {
        throw new Error("Erro ao obter dados do usuário");
    }
    return userData;
};

export const logout = async () => {
    await apiClient.post("/auth/logout/", {});
};
