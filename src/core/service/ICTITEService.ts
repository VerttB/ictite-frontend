import { Ictite } from "../interface/IIctite";

const url_base = process.env.NEXT_PUBLIC_BASE_URL
export const  GETictite = async ():Promise<Ictite> => {
    try{
        const res: Response = await fetch(`${url_base}/ictite`);
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