
export const  GETictite = async () => {
    try{
        const res: Response = await fetch("http://localhost:3000/api/project");
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            return data[0];
        }

        return null;

    }catch(e: any){
        console.error(e);
    }

}