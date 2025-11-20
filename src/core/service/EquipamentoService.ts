import { Equipment } from "../interface/Equipment";
import { getBaseUrl } from "../utils/api";

export const getEquipaments = async (): Promise<Equipment[]> => {
    try {
        const res = await fetch(`${getBaseUrl()}/equipment`);
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

export const createEquipament = async (newEquipament: FormData) => {
    try {
        const response = await fetch(`${getBaseUrl()}/equipment`, {
            method: "POST",
            body: newEquipament,
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
