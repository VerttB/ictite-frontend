import { ScienceClub, ScienceClubCreate, ScienceClubSearchParams } from "../domain/Club";
import { getBaseUrl } from "../utils/api";

// |=======| GET DE TODOS OS CLUBES DE CIÊNCIA |=======|
export const getClubesCiencia = async (
    params?: ScienceClubSearchParams
): Promise<Required<ScienceClub>[]> => {
    try {
        const query = new URLSearchParams();
        if (params?.name) query.append("name", params.name);
        if (params?.school) query.append("school", params.school);
        const res: Response = await fetch(
            `${getBaseUrl()}/clubes-ciencia/?${query.toString()}`
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


// |=======| GET TODOS OS PESQUISADORES DE UM CLUBE DE CIÊNCIAS |=======|
export const getClubeCienciaResearchers = async (id: string) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/clubes-ciencia/${id}/researchers`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
}


// |=======| GET TODOS OS PROJETOS DE UM CLUBE DE CIÊNCIAS |=======|
export const getClubeCienciaProjects = async (id: string) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/clubes-ciencia/${id}/projects`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
}

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

export const createClubeCiencias = async (club: ScienceClubCreate) => {
    try {
        const res = await fetch(`${getBaseUrl()}/clubes-ciencia`, {
            method: "POST",
            body: JSON.stringify(club),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) throw new Error(`Erro: ${res.statusText}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.warn(e);
    }
};

export const uploadClubImage = async (id: string, form: FormData) => {
    try {
        const res = await fetch(`${getBaseUrl()}/clubes-ciencia/${id}/images`, {
            method: "POST",
            body: form,
        });
        if (!res.ok) throw new Error(`Erro: ${res.statusText}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};