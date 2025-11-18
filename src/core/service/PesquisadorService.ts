import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { ResearcherFinal } from "@/core/interface/Pesquisador/ResearcherFinal";
import { Project } from "@/core/interface/Project";
import { getBaseUrl } from "@/core/utils/api";
import { PesquisadorType } from "@/schemas/PesquisadorSchema";

export const  getResearchers = async (name: string) => {
    try{
        const res: Response = await fetch(`${getBaseUrl()}/researchers/?name=${name}`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: unknown){
        console.error(e);
    }
}
export function getResearcherById(researcherId: string, full: false): Promise<Researcher | null>;
export function getResearcherById(researcherId: string, full: true): Promise<ResearcherFinal | null>;
export async function getResearcherById (researcherId:string ,full: boolean = false) {
    try{
        const res: Response = await fetch(`${getBaseUrl()}/researchers/${researcherId}?full=${full}`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: unknown){
        console.error(e);
        return null
    }
}

export async function getResearcherProjects (researcherId:string): Promise<Project[] | null> {
    try{
        const res: Response = await fetch(`${getBaseUrl()}/researchers/${researcherId}/projects`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: unknown){
        console.error(e);
        return null
    }
}

export async function getResearchersByClube (clubeId: string): Promise<Researcher[] | null> {
    try{
        const res: Response = await fetch(`${getBaseUrl()}/researchers/${clubeId}/clube`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: unknown){
        console.error(e);
        return null
    }
}

export async function createResearcher(newResearcher: PesquisadorType) {
    console.log("Creating researcher...", newResearcher);
    try{
        const res: Response = await fetch(`${getBaseUrl()}/researchers/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newResearcher)
        });
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;
    }catch(e: unknown){
        console.error(e);
        return null
    }
}