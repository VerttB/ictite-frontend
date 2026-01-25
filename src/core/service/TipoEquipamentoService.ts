import { EquipmentType } from "../domain/EquipmentType";
import { apiClient } from "@/lib/api/client";

export const getEquipamentTypes = async (): Promise<EquipmentType[]> => {
    const data = await apiClient.get<EquipmentType[]>("/equipment-types/");
    return data || [];
};
