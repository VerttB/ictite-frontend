import { MaterialType } from "@/schemas/MaterialSchema";
import { Material } from "../interface/Material";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getVideos = async (): Promise<Required<Material>[]> => {
    console.log("Base URL:", baseUrl);
    try {
        const response = await fetch(`${baseUrl}/material`, {
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

export const createVideo = async (materialData: Omit<Material, "id">) => {
    try {
        const response = await fetch(`${baseUrl}/material`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(materialData),
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
