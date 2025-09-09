import { Equipment } from "@/core/interface/Equipment";
import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { Project } from "@/core/interface/Project";
import { SchoolData } from "@/core/interface/School";

export const getSchoolGeoData =  async () => {
    try{
        const res  = await fetch("http://localhost:8000/schools/geojson")
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const  data = await res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return null; 
    }
}

export const getSchoolById =  async (id: string, full:boolean=false):Promise<SchoolData | null> => {
    try{
        const res  = await fetch(`http://localhost:8000/schools/${id}?full=${full}`)
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const  data = await res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return null; 
    }
}

export const getSchools = async () => {
     try{
        const res  = await fetch(`http://localhost:8000/schools`)
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const  data = await res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return null; 
    }
}

export const getSchoolResearchers = async (id:string): Promise<Researcher[]> => {
     try{
        const res  = await fetch(`http://localhost:8000/schools/${id}/researchers`)
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const data:Researcher[] = await res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return []; 
    }
}

export const getSchoolProjects = async (id:string):Promise<Project[]> => {
     try{
        const res  = await fetch(`http://localhost:8000/schools/${id}/projects`)
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const  data = res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar projetos de escolas:", e);
        return []; 
    }
}

export const getSchoolEquiments = async (id:string):Promise<Equipment[]> => {
     try{
        const res  = await fetch(`http://localhost:8000/schools/${id}/equipments`)
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const  data = res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar equipamentos de escolas:", e);
        return []; 
    }
}
