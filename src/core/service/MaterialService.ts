import { MaterialType } from "@/schemas/MaterialSchema";
import { Material } from "../interface/Material";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const getMaterials = async (): Promise<Required<Material>[]> => {
    console.log("Base URL:", baseUrl);
    try{
        const response = await fetch(`${baseUrl}/material`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(!response.ok){
            throw new Error('Failed to fetch materials');
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createMaterial = async (newMaterial: FormData) => {
    try{
        const response = await fetch(`${baseUrl}/material`, {
            method: 'POST',
          
            body: newMaterial,
        });
        if(!response.ok){
            throw new Error('Failed to create material');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}