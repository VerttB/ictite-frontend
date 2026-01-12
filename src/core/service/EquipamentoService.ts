import { EquipmentCreateType, EquipmentSearchParams } from "../domain/Equipment";
import { Equipment } from "@/core/domain/Equipment";
import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";

export const getEquipaments = async (
    params: EquipmentSearchParams = {}
): Promise<Pagination<Equipment>> => {
    const data = await apiClient.get<Pagination<Equipment>>("/equipment/", { params });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const createEquipament = async (newEquipament: EquipmentCreateType) => {
    return await apiClient.post("/equipment", newEquipament);
};

export const uploadEquipamentImages = async (equipmentId: string, formData: FormData) => {
    return await apiClient.post(`/equipment/${equipmentId}/images`, formData);
};
