import { Equipment } from "@/core/interface/Equipment";
import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { Project } from "@/core/interface/Project";
import { SchoolData } from "@/core/interface/School";
import { SchoolStatistics } from "@/core/interface/School/SchoolStatistics";

const url_base = process.env.NEXT_PUBLIC_BASE_URL

export const getSchoolGeoData =  async () => {
    try{
        const res  = await fetch(`${url_base}/schools/geojson`)
        
        if (!res.ok) {
            throw new Error(`Erro na buca: ${res.status} ${res.statusText}`);
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
        const res  = await fetch(`${url_base}/schools/${id}?full=${full}`)
        
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

export const getSchools = async (name:string = "", city:string = ""): Promise<SchoolData[]> => {
     try{
        const res  = await fetch(`${url_base}/schools/?name=${name}&city=${city}`)
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const  data = await res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return []; 
    }
}

export const getSchoolResearchers = async (id:string): Promise<Researcher[]> => {
     try{
        const res  = await fetch(`${url_base}/schools/${id}/researchers`)
        
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
        const res  = await fetch(`${url_base}/schools/${id}/projects`)
        
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
        const res  = await fetch(`${url_base}/schools/${id}/equipments`)
        
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


export const getSchoolStatistics = async (id:string):Promise<SchoolStatistics | null> => {
     try{
        const res  = await fetch(`${url_base}/schools/${id}/statistics`)
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const  data = res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar equipamentos de escolas:", e);
        return null; 
    }
}


