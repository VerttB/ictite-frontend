import {
    MaterialCreate,
    Material,
    MaterialSchema,
    MaterialSearchParams,
} from "../domain/Material";
import { apiClient } from "@/lib/api/client";
import { Pagination, PaginationSchema } from "@/schemas/Pagination";

export const getMaterials = async (
    params?: MaterialSearchParams
): Promise<Pagination<Material>> => {
    const data = await apiClient.get<Pagination<Material>>("/material/", { params });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const createMaterial = async (newMaterial: MaterialCreate) => {
    return await apiClient.post("/material", newMaterial);
};

export const uploadMaterialImages = async (materialId: string, images: FormData) => {
    return await apiClient.post(`/material/${materialId}/images`, images);
};
