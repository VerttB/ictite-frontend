import { ResearcherFinal } from "@/core/domain/Researcher";
import { Project } from "@/core/domain/Project";
import { getBaseUrl } from "@/core/utils/api";
import {
    Researcher,
    ResearcherCreate,
    ResearcherSearchParams,
} from "@/core/domain/Researcher";
import { buildSearchParameters } from "../utils/searchParamBuilder";

export const getResearchers = async (params?: ResearcherSearchParams) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/researchers/?${buildSearchParameters(params || {})}`
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
