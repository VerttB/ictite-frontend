import { Project, ProjectResearchers } from "../interface/Project";
import { getBaseUrl } from "../utils/api";

export const  getProjects = async (name: string = "") => {
    try{
        const res: Response = await fetch(`${getBaseUrl()}/projects/?name=${name}`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: unknown){
        console.error(e);
    }
}

export const  getProjectById = async (projectId:string): Promise<Project | null> => {
    try{
        const res: Response = await fetch(`${getBaseUrl()}/projects/${projectId}`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: unknown){
        console.error(e);
        return null;
    }
}

export const  getProjectResearchers= async (projectId : string): Promise<ProjectResearchers | null> => {
    try{
        const res: Response = await fetch(`${getBaseUrl()}/projects/${projectId}/researchers`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: unknown){
        console.error(e);
        return null
    }
}
