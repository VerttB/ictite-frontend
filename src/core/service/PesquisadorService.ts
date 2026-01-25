import { ResearcherFinal, ResearcherUpdate } from "@/core/domain/Researcher";
import { Project } from "@/core/domain/Project";
import {
    Researcher,
    ResearcherCreate,
    ResearcherSearchParams,
} from "@/core/domain/Researcher";
import { apiClient } from "@/lib/api/client";
import { Pagination } from "@/schemas/Pagination";

export const getResearchers = async (
    params?: ResearcherSearchParams
): Promise<Pagination<Researcher>> => {
    const data = await apiClient.get<Pagination<Researcher>>("/researchers/", { params });
    return data || { items: [], total: 0, page: 1, total_pages: 0, size: 0 };
};

export async function getResearcherById(researcherId: string): Promise<ResearcherFinal> {
    return await apiClient.get<ResearcherFinal>(`/researchers/${researcherId}/`);
}

export async function getResearcherProjects(researcherId: string): Promise<Project[]> {
    const data = await apiClient.get<Project[]>(`/researchers/${researcherId}/projects/`);
    return data || [];
}

export async function getResearchersByClube(clubeId: string): Promise<Researcher[]> {
    const data = await apiClient.get<Researcher[]>(`/researchers/${clubeId}/clube/`);
    return data || [];
}

export async function createResearcher(
    newResearcher: ResearcherCreate
): Promise<Researcher> {
    return await apiClient.post<Researcher>("/researchers/", newResearcher);
}
export async function updateResearcher(
    researcherId: string,
    updatedResearcher: Partial<ResearcherUpdate>
): Promise<Researcher> {
    return await apiClient.patch<Researcher>(
        `/researchers/${researcherId}`,
        updatedResearcher
    );
}
export async function deleteResearcher(researcherId: string): Promise<void> {
    await apiClient.delete(`/researchers/${researcherId}/`);
}
