import {
    MaterialCreate,
    Material,
    MaterialSchema,
    MaterialUpdate,
    MaterialSearchParams,
} from "../domain/Material";
import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";

export const getMaterials = async (
    params?: MaterialSearchParams
): Promise<Pagination<Material>> => {
    const data = await apiClient.get<Pagination<Material>>("/material/", { params });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const createMaterial = async (newMaterial: MaterialCreate): Promise<Material> => {
    const data = await apiClient.post<Material>("/material", newMaterial);
    if (!data) {
        throw new Error("Erro ao criar material");
    }
    return data;
};

export const uploadMaterialImages = async (materialId: string, images: FormData) => {
    return await apiClient.post(`/material/${materialId}/images`, images);
};

export const updateMaterial = async (
    materialId: string,
    updatedMaterial: Partial<MaterialUpdate>
) => {
    return await apiClient.patch(`/material/${materialId}`, updatedMaterial);
};
export const deleteMaterial = async (materialId: string) => {
    return await apiClient.delete(`/material/${materialId}`);
};
