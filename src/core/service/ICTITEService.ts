import { Ictite } from "../interface/IIctite";
import { getBaseUrl } from "../utils/api";

export const  GETictite = async ():Promise<Ictite> => {
    try{
        const res = await fetch(`${getBaseUrl()}/ictite/`);
        if(!res) throw new Error(`Erro: ${res}`)

        const data = await res.json();
         return data;

    }catch(e: unknown){
        console.error(e);
        
        throw new Error("Erro ao buscar ictite")
       
    }

}