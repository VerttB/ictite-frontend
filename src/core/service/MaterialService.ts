import { MaterialCreate, Material, MaterialSearchParams } from "../domain/Material";
import { apiClient } from "@/lib/api/client";

export const getMaterials = async (
    params?: MaterialSearchParams
): Promise<Required<Material>[]> => {
    const data = await apiClient.get<Required<Material>[]>("/material/", { params });
    return data || [];
};

export const createMaterial = async (newMaterial: MaterialCreate) => {
    return await apiClient.post("/material", newMaterial);
};

export const uploadMaterialImages = async (materialId: string, images: FormData) => {
    return await apiClient.post(`/material/${materialId}/images`, images);
};
