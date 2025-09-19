import { Project, ProjectResearchers } from "../interface/Project";

const url_base = process.env.NEXT_PUBLIC_BASE_URL


export const  getProjects = async (name: string = "") => {
    try{
        const res: Response = await fetch(`${url_base}/projects/?name=${name}`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: unknown){
        console.error(e);
    }
}

export const  getProjectById = async (projectId:string): Promise<Project | null> => {
    try{
        const res: Response = await fetch(`${url_base}/projects/${projectId}`);
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
        const res: Response = await fetch(`${url_base}/projects/${projectId}/researchers`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        console.log(data)
        return data;

    }catch(e: unknown){
        console.error(e);
        return null
    }
}
