import {
    MaterialCreate,
    Material,
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
    return await apiClient.post<Material>("/material", newMaterial);
};

export const uploadMaterialImages = async (materialId: string, images: FormData) => {
    return await apiClient.post(`/material/${materialId}/images`, images);
};

export const updateMaterial = async (
    materialId: string,
    updatedMaterial: Partial<MaterialUpdate>
): Promise<Material> => {
    return await apiClient.patch<Material>(`/material/${materialId}`, updatedMaterial);
};
export const deleteMaterial = async (materialId: string): Promise<void> => {
    await apiClient.delete(`/material/${materialId}`);
};
