import { Pagination } from "@/schemas/Pagination";
import {
    ScienceClub,
    ScienceClubCreate,
    ScienceClubUpdate,
    ScienceClubSearchParams,
    ScienceClubStatisticsAll,
    ScienceClubStatistics,
} from "../domain/Club";
import { apiClient } from "@/lib/api/client";
import { Project } from "../domain/Project";
import { ResearcherByType } from "../domain/Researcher";

// |=======| GET DE TODOS OS CLUBES DE CIÊNCIA |=======|
export const getClubesCiencia = async (
    params?: ScienceClubSearchParams
): Promise<Pagination<ScienceClub>> => {
    return (
        (await apiClient.get<Pagination<ScienceClub>>("/clubes-ciencia/", {
            params,
        })) || { items: [], total: 0, page: 1, total_pages: 0, size: 0 }
    );
};

// |=======| GET DE UM CLUBE DE CIÊNCIA PELO ID |=======|
export const getClubeCienciaById = async (id: string): Promise<ScienceClub> => {
    return await apiClient.get<ScienceClub>(`/clubes-ciencia/${id}`);
};

// |=======| GET TODOS OS CLUBES DE CIÊNCIA DE UMA ESCOLA |=======|

// |=======| GET TODOS OS PESQUISADORES DE UM CLUBE DE CIÊNCIAS |=======|
export const getClubeCienciaResearchers = async (
    id: string
): Promise<ResearcherByType> => {
    const data = await apiClient.get<ResearcherByType>(
        `/clubes-ciencia/${id}/researchers`
    );
    return data || { professor: [], aluno: [], coordenador: [] };
};

// |=======| GET TODOS OS PROJETOS DE UM CLUBE DE CIÊNCIAS |=======|
export const getClubeCienciaProjects = async (id: string): Promise<Project[]> => {
    const data = await apiClient.get<Project[]>(`/clubes-ciencia/${id}/projects`);
    return data || [];
};

// |=======| GET ESTATÍSTICAS DE UM CLUBE DE CIÊNCIAS |=======|
export const getClubeCienciaStats = async (
    id: string
): Promise<ScienceClubStatistics> => {
    return (
        (await apiClient.get(`/clubes-ciencia/${id}/statistics`)) || {
            total_alunos: 0,
            total_coordenadores: 0,
            total_professores: 0,
            total_projetos: 0,
        }
    );
};

// |=======| GET ESTATÍSTICAS DE TODOS OS CLUBES DE CIÊNCIAS |=======|
export const getClubesCienciaStats = async (): Promise<ScienceClubStatisticsAll> => {
    const data = await apiClient.get<ScienceClubStatisticsAll>(
        "/clubes-ciencia/statistics"
    );

    return (
        data || {
            total_clubes: 0,
            total_alunos: 0,
            total_coordenadores: 0,
            total_professores: 0,
            total_projetos: 0,
        }
    );
};

export const createClubeCiencias = async (
    club: ScienceClubCreate
): Promise<ScienceClub> => {
    return await apiClient.post<ScienceClub>("/clubes-ciencia", club);
};

export const updateClubeCiencias = async (
    clubeId: string,
    updatedClube: Partial<ScienceClubUpdate>
): Promise<ScienceClub> => {
    return await apiClient.patch<ScienceClub>(`/clubes-ciencia/${clubeId}`, updatedClube);
};

export const deleteClubeCiencias = async (clubeId: string): Promise<void> => {
    await apiClient.delete(`/clubes-ciencia/${clubeId}`);
};
export const uploadClubImage = async (id: string, form: FormData) => {
    return await apiClient.post(`/clubes-ciencia/${id}/images`, form);
};
