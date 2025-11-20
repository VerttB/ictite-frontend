import { TypeEquipment } from "../interface/TypeEquipment";
import { getBaseUrl } from "../utils/api";

export const getEquipamentTypes = async (): Promise<TypeEquipment[]> => {
    try {
        const res = await fetch(`${getBaseUrl()}/equipmentTypes`);
        if (!res.ok) {
            throw new Error("Failed to fetch equipment types");
        }
        const data = await res.json();
        return data || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};
