import { ResearcherByType } from "../interface/Pesquisador/ResearcherByType";
import { Project, ProjectResearchers } from "../interface/Project";
import { getBaseUrl } from "../utils/api";

export const getProjects = async (name: string = "") => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/projects/?name=${name}`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};

export const getProjectById = async (
    projectId: string
): Promise<Project | null> => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/projects/${projectId}`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return null;
    }
};

export const getProjectResearchers = async ( projectId: string ) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/projects/${projectId}/researchers`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
};

export const getProjectbyClube = async (
    clubeId: string
): Promise<Project[] | null> => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/projects/${clubeId}/clube`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return null;
    }
};


export const getProjectStatistics = async (projectId: string) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/projects/${projectId}/statistic`
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
    }
}

export const createProject = async (data: FormData) => {
    console.log("Creating project with data:", data);
    try {
        const res: Response = await fetch(`${getBaseUrl()}/projects/`, {
            method: "POST",
            body: data,
        });
        if (!res) throw new Error(`Erro: ${res}`);
        const responseData = await res.json();
        return responseData;
    } catch (e: unknown) {
        console.error(e);
        return null;
    }
};
