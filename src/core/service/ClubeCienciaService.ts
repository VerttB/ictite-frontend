import { getBaseUrl } from "../utils/api";

// |=======| GET DE TODOS OS CLUBES DE CIÊNCIA |=======|
export const getClubesCiencia = async () => {
    try {
        const res: Response = await fetch(`${getBaseUrl()}/clubeCiencia`);
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};

// |=======| GET DE UM CLUBE DE CIÊNCIA PELO ID |=======|
export const getClubeCienciaById = async (id: string) => {
    try {
        const res: Response = await fetch(`${getBaseUrl()}/clubeCiencia/${id}`);
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};