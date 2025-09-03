export const getSchoolGeoData =  async () => {
    try{
        const res  = await fetch("http://localhost:8000/schools/geojson")
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const  data = res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return null; 
    }
}

export const getSchoolFull =  async (id: string) => {
    try{
        const res  = await fetch("http://localhost:8000/schools/geojson")
        
        if (!res.ok) {
            throw new Error(`Erro na busca: ${res.status} ${res.statusText}`);
        }

        const  data = res.json()

        return data
    } catch (e) {
        console.error("Falha ao buscar dados de escolas:", e);
        return null; 
    }
}


