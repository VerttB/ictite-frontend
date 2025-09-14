
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