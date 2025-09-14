import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { ResearcherFinal } from "@/core/interface/Pesquisador/ResearcherFinal";

export const  getResearchers = async (name: string) => {
    try{
        const res: Response = await fetch(`http://localhost:8000/researchers?name=${name}`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: any){
        console.error(e);
    }
}
export function getResearcherById(researcherId: string, full: false): Promise<Researcher | null>;
export function getResearcherById(researcherId: string, full: true): Promise<ResearcherFinal | null>;
export async function getResearcherById (researcherId:string ,full: boolean = false) {
    try{
        const res: Response = await fetch(`http://localhost:8000/researchers/${researcherId}?full=${full}`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: any){
        console.error(e);
        return null
    }
}

export const GetPesquisadorSIMCC = async (name: string) => {

    try{
        const res: Response = await fetch(`https://simcc.uesc.br/v3/api/researcherName?name=${name}`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: any){
        console.error(e)
    }
}