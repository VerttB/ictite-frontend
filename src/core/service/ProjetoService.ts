import { Pagination } from "@/schemas/Pagination";
import {
    Project,
    ProjectCreate,
    ProjectSearchParams,
    ProjectStatistic,
    ProjectUpdate,
} from "../domain/Project";
import { apiClient } from "@/lib/api/client";

export const getProjects = async (
    params?: ProjectSearchParams
): Promise<Pagination<Project>> => {
    const data = await apiClient.get<Pagination<Project>>("/projects/", { params });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export const getProjectById = async (projectId: string): Promise<Project> => {
    const data = await apiClient.get<Project>(`/projects/${projectId}`);
    if (!data) {
        throw new Error("Projeto não encontrado");
    }
    return data;
};

export const getProjectResearchers = async (projectId: string) => {
    const data = await apiClient.get(`/projects/${projectId}/researchers`);
    return data || [];
};

export const getProjectbyClube = async (clubeId: string): Promise<Project[]> => {
    const data = await apiClient.get<Project[]>(`/projects/${clubeId}/clube`);
    return data || [];
};

export const getProjectStatistics = async (
    projectId: string
): Promise<ProjectStatistic> => {
    const data = await apiClient.get<ProjectStatistic>(
        `/projects/${projectId}/statistics`
    );
    if (!data) throw new Error("Estatísticas do projeto não encontradas");
    return data;
};

export const createProject = async (newProject: ProjectCreate): Promise<Project> => {
    const data = await apiClient.post<Project>("/projects/", newProject);
    if (!data) {
        throw new Error("Erro ao criar projeto");
    }
    return data;
};

export const updateProject = async (
    projectId: string,
    updatedProject: Partial<ProjectUpdate>
) => {
    return await apiClient.patch(`/projects/${projectId}`, updatedProject);
};

export const deleteProject = async (projectId: string) => {
    return await apiClient.delete(`/projects/${projectId}`);
};

export const uploadProjectImages = async (projectId: string, formData: FormData) => {
    return await apiClient.post(`/projects/${projectId}/images`, formData);
};
