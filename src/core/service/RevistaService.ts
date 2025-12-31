import { Magazine, MagazineCreate, MagazineSearchParams } from "../domain/Magazine";
import { apiClient } from "@/lib/api/client";

export const getRevistas = async (
    params?: MagazineSearchParams
): Promise<Required<Magazine>[]> => {
    const data = await apiClient.get<Required<Magazine>[]>("/magazine/", { params });
    return data || [];
};

export const createRevista = async (newRevista: MagazineCreate) => {
    return await apiClient.post("/magazine/", newRevista);
};

export const uploadMagazineImage = async (magazineId: string, formData: FormData) => {
    return await apiClient.post(`/magazine/${magazineId}/images`, formData);
};
