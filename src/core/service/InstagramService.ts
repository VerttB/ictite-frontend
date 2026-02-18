import { apiClient } from "@/lib/api/client";
import { InstagramPost, InstagramSearchParams } from "../domain/Instagram";
import { getBaseUrl } from "../utils/api";

export const getInstagramPosts = async (
    params: InstagramSearchParams = {}
): Promise<InstagramPost[]> => {
    const data = await apiClient.get<InstagramPost[]>("/instagram/news", { params });
    return data || [];
};

// NO FUTURO: COLOCAR TOKEN NA REQUISICAO
export const syncInstagramPosts = async (): Promise<{ mensagem: string }> => {
    try {
        const res = await fetch(`${getBaseUrl()}/instagram/sync`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("Erro ao sincronizar com Instagram");
        }

        return await res.json();
    } catch (error) {
        console.error("InstagramService.sync:", error);
        throw error;
    }
};
