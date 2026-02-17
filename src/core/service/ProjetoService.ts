import { Pagination } from "@/schemas/Pagination";
import {
    Project,
    ProjectCreate,
    ProjectSearchParams,
    ProjectStatistic,
    ProjectUpdate,
} from "../domain/Project";
import { apiClient } from "@/lib/api/client";
import { ResearcherByType } from "../domain/Researcher";

export const getProjects = async (
    params?: ProjectSearchParams
): Promise<Pagination<Project>> => {
    return await apiClient.get<Pagination<Project>>("/projects/", { params });
};

export const getProjectById = async (projectId: string): Promise<Project> => {
    return await apiClient.get<Project>(`/projects/${projectId}`);
};
export const getProjectResearchers = async (
    projectId: string
): Promise<ResearcherByType> => {
    return await apiClient.get<ResearcherByType>(`/projects/${projectId}/researchers/`);
};

export const getProjectbyClube = async (clubeId: string): Promise<Project[]> => {
    return await apiClient.get<Project[]>(`/projects/${clubeId}/clube`);
};

export const getProjectStatistics = async (
    projectId: string
): Promise<ProjectStatistic> => {
    return await apiClient.get<ProjectStatistic>(`/projects/${projectId}/statistics`);
};

export const createProject = async (newProject: ProjectCreate): Promise<Project> => {
    return await apiClient.post<Project>("/projects/", newProject);
};

export const updateProject = async (
    projectId: string,
    updatedProject: Partial<ProjectUpdate>
): Promise<Project> => {
    return await apiClient.patch<Project>(`/projects/${projectId}`, updatedProject);
};

export const deleteProject = async (projectId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}`);
};

export const uploadProjectImages = async (projectId: string, formData: FormData) => {
    return await apiClient.post(`/projects/${projectId}/images`, formData);
};
