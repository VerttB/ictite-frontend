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
    return (
        (await apiClient.get<Pagination<Magazine>>("/magazine/", { params })) || {
            items: [],
            total: 0,
            page: 1,
            total_pages: 0,
            size: 0,
        }
    );
};

export const createRevista = async (newRevista: MagazineCreate): Promise<Magazine> => {
    return await apiClient.post<Magazine>("/magazine/", newRevista);
};

export const uploadMagazineImage = async (magazineId: string, formData: FormData) => {
    return await apiClient.post(`/magazine/${magazineId}/images/`, formData);
};

export const updateRevista = async (
    magazineId: string,
    updatedRevista: Partial<MagazineUpdate>
): Promise<Magazine> => {
    return await apiClient.patch<Magazine>(`/magazine/${magazineId}/`, updatedRevista);
};

export const deleteRevista = async (magazineId: string): Promise<void> => {
    return await apiClient.delete(`/magazine/${magazineId}/`);
};
