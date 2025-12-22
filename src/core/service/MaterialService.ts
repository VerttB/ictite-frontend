import { MaterialCreate, Material, MaterialSearchParams } from "../domain/Material";
import { getBaseUrl } from "../utils/api";

export const getMaterials = async (params?: MaterialSearchParams): Promise<Required<Material>[]> => {
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

export const createMaterial = async (newMaterial: MaterialCreate) => {
    try {
        const response = await fetch(`${getBaseUrl()}/material`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newMaterial),
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

export const uploadMaterialImages = async (materialId: string, images: FormData) => {
    try {
        const response = await fetch(`${getBaseUrl()}/material/${materialId}/images`, {
            method: "POST",
            body: images,
        });
        if (!response.ok) {
            throw new Error("Failed to upload material images");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};