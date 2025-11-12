import { getBaseUrl } from "../utils/api";

// |=======| GET DE TODOS OS CLUBES DE CIÊNCIA |=======|
export const getClubesCiencia = async (title: string = "") => {
    try {
        const res: Response = await fetch(`${getBaseUrl()}/clubeCiencia/?title=${title}`);
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

// |=======| GET TODOS OS CLUBES DE CIÊNCIA DE UMA ESCOLA |=======|
export const getClubesCienciaBySchool = async (school_id: string) => {
    try {
        const res: Response = await fetch(`${getBaseUrl()}/clubeCiencia/${school_id}/school`);
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};