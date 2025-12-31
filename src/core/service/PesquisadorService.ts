import { ResearcherFinal } from "@/core/domain/Researcher";
import { Project } from "@/core/domain/Project";
import {
    Researcher,
    ResearcherCreate,
    ResearcherSearchParams,
} from "@/core/domain/Researcher";
import { apiClient } from "@/lib/api/client";

export const getResearchers = async (params?: ResearcherSearchParams) => {
    const data = await apiClient.get("/researchers/", { params });
    return data || [];
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
