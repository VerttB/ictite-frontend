import { ScienceClub, ScienceClubCreate, ScienceClubSearchParams } from "../domain/Club";
import { apiClient } from "@/lib/api/client";

// |=======| GET DE TODOS OS CLUBES DE CIÊNCIA |=======|
export const getClubesCiencia = async (
    params?: ScienceClubSearchParams
): Promise<Required<ScienceClub>[]> => {
    const data = await apiClient.get<Required<ScienceClub>[]>("/clubes-ciencia/", {
        params,
    });
    return data || [];
};

// |=======| GET DE UM CLUBE DE CIÊNCIA PELO ID |=======|
export const getClubeCienciaById = async (id: string) => {
    const data = await apiClient.get(`/clubes-ciencia/${id}`);
    if (!data) {
        throw new Error("Clube de ciência não encontrado");
    }
    return data;
};

// |=======| GET TODOS OS CLUBES DE CIÊNCIA DE UMA ESCOLA |=======|

// |=======| GET TODOS OS PESQUISADORES DE UM CLUBE DE CIÊNCIAS |=======|
export const getClubeCienciaResearchers = async (id: string) => {
    const data = await apiClient.get(`/clubes-ciencia/${id}/researchers`);
    return data || [];
};

// |=======| GET TODOS OS PROJETOS DE UM CLUBE DE CIÊNCIAS |=======|
export const getClubeCienciaProjects = async (id: string) => {
    const data = await apiClient.get(`/clubes-ciencia/${id}/projects`);
    return data || [];
};

// |=======| GET ESTATÍSTICAS DE UM CLUBE DE CIÊNCIAS |=======|
export const getClubeCienciaStats = async (id: string) => {
    return await apiClient.get(`/clubes-ciencia/${id}/statistics`);
};

// |=======| GET ESTATÍSTICAS DE TODOS OS CLUBES DE CIÊNCIAS |=======|
export const getClubesCienciaStats = async () => {
    return await apiClient.get("/clubes-ciencia/statistics");
};

export const createClubeCiencias = async (club: ScienceClubCreate) => {
    return await apiClient.post("/clubes-ciencia", club);
};

export const uploadClubImage = async (id: string, form: FormData) => {
    return await apiClient.post(`/clubes-ciencia/${id}/images`, form);
};
