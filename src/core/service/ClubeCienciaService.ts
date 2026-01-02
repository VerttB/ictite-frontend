import { Pagination } from "@/schemas/Pagination";
import {
    ScienceClub,
    ScienceClubCreate,
    ScienceClubSearchParams,
    ScienceClubStatisticsAll,
} from "../domain/Club";
import { apiClient } from "@/lib/api/client";

// |=======| GET DE TODOS OS CLUBES DE CIÊNCIA |=======|
export const getClubesCiencia = async (
    params?: ScienceClubSearchParams
): Promise<Pagination<ScienceClub>> => {
    console.log(params);
    const data = await apiClient.get<Pagination<ScienceClub>>("/clubes-ciencia/", {
        params,
    });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
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
export const getClubesCienciaStats = async (): Promise<ScienceClubStatisticsAll> => {
    const data = await apiClient.get<ScienceClubStatisticsAll>(
        "/clubes-ciencia/statistics"
    );
    if (!data) {
        throw new Error("Estatísticas dos clubes de ciência não encontradas");
    }
    return data;
};

export const createClubeCiencias = async (
    club: ScienceClubCreate
): Promise<ScienceClub> => {
    const data = await apiClient.post<ScienceClub>("/clubes-ciencia", club);
    if (!data) {
        throw new Error("Erro ao criar clube de ciência");
    }
    return data;
};

export const uploadClubImage = async (id: string, form: FormData) => {
    return await apiClient.post(`/clubes-ciencia/${id}/images`, form);
};
