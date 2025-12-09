import { ClubeCiencia } from "../interface/Clube/ClubeCiencia";
import { getBaseUrl } from "../utils/api";

// |=======| GET DE TODOS OS CLUBES DE CIÊNCIA |=======|
export const getClubesCiencia = async (
    title: string = ""
): Promise<Required<ClubeCiencia>[]> => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/clubes-ciencia/?name=${title}`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return [];
    }
};

// |=======| GET DE UM CLUBE DE CIÊNCIA PELO ID |=======|
export const getClubeCienciaById = async (id: string) => {
    try {
        const res: Response = await fetch(`${getBaseUrl()}/clubes-ciencia/${id}`);
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
        const res: Response = await fetch(
            `${getBaseUrl()}/clubes-ciencia/${school_id}/school`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};

// |=======| GET ESTATÍSTICAS DE UM CLUBE DE CIÊNCIAS |=======|
export const getClubeCienciaStats = async (id: string) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/clubes-ciencia/${id}/statistics`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};

// |=======| GET ESTATÍSTICAS DE TODOS OS CLUBES DE CIÊNCIAS |=======|
export const getClubesCienciaStats = async () => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/clubes-ciencia/statistics`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};

export const createClubeCiencias = async (form: FormData) => {
    console.log("Criando clube no service", form);
    try {
        const res = await fetch(`${getBaseUrl()}/clubes-ciencia`, {
            method: "POST",
            body: form,
        });
        if (!res.ok) throw new Error(`Erro: ${res.statusText}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.warn(e);
    }
};
