import {
    EquipmentCreate,
    EquipmentSearchParams,
    EquipmentUpdate,
} from "../domain/Equipment";
import { Equipment } from "@/core/domain/Equipment";
import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";

export const getEquipaments = async (
    params: EquipmentSearchParams = {}
): Promise<Pagination<Equipment>> => {
    const data = await apiClient.get<Pagination<Equipment>>("/equipment/", { params });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const createEquipament = async (
    newEquipament: EquipmentCreate
): Promise<Equipment> => {
    return await apiClient.post<Equipment>("/equipment/", newEquipament);
};

export const uploadEquipamentImages = async (equipmentId: string, formData: FormData) => {
    return await apiClient.post(`/equipment/${equipmentId}/images/`, formData);
};

export const updateEquipament = async (
    equipmentId: string,
    updatedEquipament: Partial<EquipmentUpdate>
): Promise<Equipment> => {
    return await apiClient.patch<Equipment>(
        `/equipment/${equipmentId}/`,
        updatedEquipament
    );
};

export const deleteEquipament = async (equipmentId: string): Promise<void> => {
    await apiClient.delete(`/equipment/${equipmentId}/`);
};
