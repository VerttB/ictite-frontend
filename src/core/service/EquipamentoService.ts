import { EquipmentCreateType, EquipmentSearchParams } from "../domain/Equipment";
import { Equipment } from "@/core/domain/Equipment";
import { apiClient } from "@/lib/api/client";

export const getEquipaments = async (
    params: EquipmentSearchParams = {}
): Promise<Equipment[]> => {
    const data = await apiClient.get<Equipment[]>("/equipment/", { params });
    return data || [];
};

export const createEquipament = async (newEquipament: EquipmentCreateType) => {
    return await apiClient.post("/equipment", newEquipament);
};

export const uploadEquipamentImages = async (equipmentId: string, formData: FormData) => {
    return await apiClient.post(`/equipment/${equipmentId}/images`, formData);
};
