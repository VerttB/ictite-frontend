import {
    Magazine,
    MagazineCreate,
    MagazineSearchParams,
    MagazineUpdate,
} from "../domain/Magazine";
import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";

export const getRevistas = async (
    params?: MagazineSearchParams
): Promise<Pagination<Magazine>> => {
    const data = await apiClient.get<Pagination<Magazine>>("/magazine/", { params });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const createRevista = async (newRevista: MagazineCreate) => {
    return await apiClient.post("/magazine/", newRevista);
};

export const uploadMagazineImage = async (magazineId: string, formData: FormData) => {
    return await apiClient.post(`/magazine/${magazineId}/images`, formData);
};

export const updateRevista = async (
    magazineId: string,
    updatedRevista: Partial<MagazineUpdate>
) => {
    return await apiClient.patch(`/magazine/${magazineId}`, updatedRevista);
};

export const deleteRevista = async (magazineId: string) => {
    return await apiClient.delete(`/magazine/${magazineId}`);
};
