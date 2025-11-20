import { Material } from "../interface/Material";
import { getBaseUrl } from "../utils/api";

export const getMaterials = async (): Promise<Required<Material>[]> => {
    try {
        const response = await fetch(`${getBaseUrl()}/material`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch materials");
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createMaterial = async (newMaterial: FormData) => {
    try {
        const response = await fetch(`${getBaseUrl()}/material`, {
            method: "POST",

            body: newMaterial,
        });
        if (!response.ok) {
            throw new Error("Failed to create material");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
