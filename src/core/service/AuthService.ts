import { UserLogin } from "@/core/domain/User";
import { User } from "@/core/domain/User";
import { apiClient } from "@/lib/api/client";
import {
    GenerateInviteResponse,
    RegisterInvitedRequest,
} from "@/core/domain/Invite";

export const login = async (loginRequest: UserLogin) => {
    return await apiClient.post("/auth/login", loginRequest);
};

export const me = async (): Promise<User> => {
    const userData = await apiClient.get<User>("/auth/me");
    if (!userData) {
        throw new Error("Erro ao obter dados do usuário");
    }
    return userData;
};

export const logout = async () => {
    await apiClient.post("/auth/logout", {});
};

export const registerInvited = async (
    payload: RegisterInvitedRequest
): Promise<User> => {
    const userData = await apiClient.post<User>("/auth/register/invited", payload);
    if (!userData) {
        throw new Error("Erro ao ativar a conta do convidado");
    }
    return userData;
};

export const generateSchoolInvite = async (
    schoolId: string
): Promise<GenerateInviteResponse> => {
    return await apiClient.post<GenerateInviteResponse>(
        `/admin/schools/${schoolId}/invite-token`,
        {}
    );
};
