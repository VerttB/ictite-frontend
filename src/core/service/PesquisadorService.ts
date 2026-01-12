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

export async function getResearcherById(researcherId: string, full: boolean = false) {
    const data = await apiClient.get(`/researchers/${researcherId}`, {
        params: { full },
    });
    if (!data) {
        throw new Error("Pesquisador não encontrado");
    }
    return data;
}

export async function getResearcherProjects(researcherId: string): Promise<Project[]> {
    const data = await apiClient.get<Project[]>(`/researchers/${researcherId}/projects`);
    return data || [];
}

export async function getResearchersByClube(clubeId: string): Promise<Researcher[]> {
    const data = await apiClient.get<Researcher[]>(`/researchers/${clubeId}/clube`);
    return data || [];
}

export async function createResearcher(newResearcher: ResearcherCreate) {
    console.log("Creating researcher...", newResearcher);
    return await apiClient.post("/researchers/", newResearcher);
}

export async function updateResearcher(
    researcherId: string,
    updatedResearcher: Partial<ResearcherUpdate>
) {
    return await apiClient.patch(`/researchers/${researcherId}`, updatedResearcher);
}
export async function deleteResearcher(researcherId: string) {
    return await apiClient.delete(`/researchers/${researcherId}`);
}
