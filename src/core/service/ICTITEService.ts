import { Ictite } from "../interface/IIctite";

const url_base = process.env.NEXT_PUBLIC_BASE_URL
export const  GETictite = async ():Promise<Ictite> => {
    try{
        const res = await fetch(`${url_base}/ictite/`);
        if(!res) throw new Error(`Erro: ${res}`)

        const data = await res.json();
         return data;

    }catch(e: unknown){
        console.error(e);
        
        throw new Error("Erro ao buscar ictite")
       
    }

}