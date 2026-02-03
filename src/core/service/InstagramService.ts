import { InstagramPost, InstagramSearchParams } from "../domain/Instagram";
import { getBaseUrl } from "../utils/api";
import { buildSearchParameters } from "../utils/searchParamBuilder";


export const getInstagramPosts = async (
    params: InstagramSearchParams = {}
): Promise<InstagramPost[]> => {
    try {
        const queryString = buildSearchParameters(params || {});
        const url = `${getBaseUrl()}/instagram/news${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Erro ao buscar posts do Instagram");
        }

        const data = await res.json();
        return data || [];
    } catch (error) {
        console.error("InstagramService.getPosts:", error);
        throw error;
    }
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