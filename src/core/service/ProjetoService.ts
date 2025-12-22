import {Project, ProjectCreate, ProjectSearchParams } from "../domain/Project";
import { getBaseUrl } from "../utils/api";

export const getProjects = async (params: ProjectSearchParams = {}) => {
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

export const createProject = async (data: ProjectCreate) => {
    try {
        const res: Response = await fetch(`${getBaseUrl()}/projects/`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!res) throw new Error(`Erro: ${res}`);
        const responseData = await res.json();
        return responseData;
    } catch (e: unknown) {
        console.error(e);
        return null;
    }
};

export const uploadProjectImages = async (
    projectId: string,
    formData: FormData
) => {
    try {
        const res: Response = await fetch(
            `${getBaseUrl()}/projects/${projectId}/images`,
            {
                method: "POST",
                body: formData,
            }
        );
        if (!res) throw new Error(`Erro: ${res}`);
        const data = await res.json();
        return data;
    } catch (e: unknown) {
        console.error(e);
        return null;
    }
};