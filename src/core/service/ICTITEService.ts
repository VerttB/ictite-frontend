import { Ictite } from "../interface/IIctite";

const url_base = process.env.URL_BASE
export const  GETictite = async ():Promise<Ictite> => {
    try{
        const res: Response = await fetch(`${url_base}/project`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        // if (Array.isArray(data) && data.length > 0) {
        //     return data[0];
        // }

        return data;

    }catch(e: any){
        console.error(e);
        throw new Error(e)
       
    }

}