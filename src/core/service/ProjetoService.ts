import { Project, ProjectCreate, ProjectSearchParams } from "../domain/Project";
import { apiClient } from "@/lib/api/client";

export const getProjects = async (params?: ProjectSearchParams) => {
    const data = await apiClient.get("/projects/", { params });
    return data || [];
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

export const getProjectStatistics = async (projectId: string) => {
    return await apiClient.get(`/projects/${projectId}/statistic`);
};

export const createProject = async (data: ProjectCreate) => {
    return await apiClient.post("/projects/", data);
};

export const uploadProjectImages = async (projectId: string, formData: FormData) => {
    return await apiClient.post(`/projects/${projectId}/images`, formData);
};
