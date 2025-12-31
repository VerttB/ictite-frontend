import { Ictite } from "../interface/IIctite";
import { apiClient } from "@/lib/api/client";

export const GETictite = async (): Promise<Ictite> => {
    const data = await apiClient.get<Ictite>("/ictite/");
    if (!data) {
        throw new Error("Erro ao buscar ictite");
    }
    return data;
};
