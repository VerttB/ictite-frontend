export const GETBibliographicProductionResearcher = async (researcherId: string, type: string) => {

    try{
        const res: Response = await fetch(`https://simcc.uesc.br/v3/api/bibliographic_production_researcher?researcher_id=${researcherId}&type=${type}`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: unknown){
        console.error(e)
    }
}