import { EquipmentCreateType, EquipmentSearchParams } from "../domain/Equipment";
import { Equipment } from "@/core/domain/Equipment";
import { getBaseUrl } from "../utils/api";

export const getEquipaments = async (params: EquipmentSearchParams = {}): Promise<Equipment[]> => {
    try {
        const query = new URLSearchParams();
        if (params.name) query.append("name", params.name);
        const res = await fetch(`${getBaseUrl()}/equipment/?${query.toString()}`);
        if (!res.ok) {
            throw new Error("Failed to fetch equipments");
        }
        const data = await res.json();
        return data || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createEquipament = async (newEquipament: EquipmentCreateType) => {
    try {
        const response = await fetch(`${getBaseUrl()}/equipment`, {
            method: "POST",
            body: JSON.stringify(newEquipament),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to create equipment");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const uploadEquipamentImages = async ( equipmentId: string, formData: FormData ) => {
    try {
        const response = await fetch(`${getBaseUrl()}/equipment/${equipmentId}/images`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to upload equipment images");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};