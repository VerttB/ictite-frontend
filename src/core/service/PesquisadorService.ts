import { ResearcherFinal } from "@/core/domain/Researcher";
import { Project } from "@/core/domain/Project";
import { getBaseUrl } from "@/core/utils/api";
import {Researcher,  ResearcherCreate, ResearcherSearchParams } from "@/core/domain/Researcher";

export const getResearchers = async (params?: ResearcherSearchParams) => {
    try {
        const query = new URLSearchParams();
        if (params?.name) query.append("name", params.name);
        if (params?.type) params.type.forEach(type => query.append("type", type));
        if (params?.gender) params.gender.forEach(gender => query.append("gender", gender));
        if (params?.race) params.race.forEach(race => query.append("race", race));
        if (params?.page) query.append("page", params.page.toString());

        const res: Response = await fetch(
            `${getBaseUrl()}/researchers/?${query.toString()}`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};
export function getResearcherById(
    researcherId: string,
    full: false
): Promise<Researcher | null>;
export function getResearcherById(
    researcherId: string,
    full: true
): Promise<ResearcherFinal | null>;
export async function getResearcherById(
    researcherId: string,
    full: boolean = false
) {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/researchers/${researcherId}?full=${full}`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return null;
    }
}

export async function getResearcherProjects(
    researcherId: string
): Promise<Project[] | null> {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/researchers/${researcherId}/projects`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return null;
    }
}

export async function getResearchersByClube(
    clubeId: string
): Promise<Researcher[] | null> {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/researchers/${clubeId}/clube`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return null;
    }
}

export async function createResearcher(newResearcher: ResearcherCreate) {
    console.log("Creating researcher...", newResearcher);
    try {
        const res: Response = await fetch(`${getBaseUrl()}/researchers/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newResearcher),
        });
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return null;
    }
}
