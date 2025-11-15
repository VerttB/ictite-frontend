
import { Revista } from "../interface/Revista";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const getRevistas = async (): Promise<Required<Revista>[]> => {
    console.log("Base URL:", baseUrl);
    try{
        const response = await fetch(`${baseUrl}/magazine`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(!response.ok){
            throw new Error('Failed to fetch revistas');
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createRevista = async (materialData: Omit<Revista, "id">) => {
    console.log("Creating revista with data:", materialData);
    try{
        const response = await fetch(`${baseUrl}/magazine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(materialData),
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