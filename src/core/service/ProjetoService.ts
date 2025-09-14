export const  getProjects = async (name: string = "") => {
    try{
        const res: Response = await fetch(`http://localhost:8000/projects?`);
        if(!res) throw new Error(`Erro: ${res}`)
        const data = await res.json();
        return data;

    }catch(e: any){
        console.error(e);
    }
}