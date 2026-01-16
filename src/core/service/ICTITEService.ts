import { apiClient } from "@/lib/api/client";

export const GETictite = async (): Promise<{ link: string; objective: string }> => {
    return await apiClient.get<{ link: string; objective: string }>("/ictite/");
};
