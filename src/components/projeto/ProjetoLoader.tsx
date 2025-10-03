import { Project } from "@/core/interface/Project";
import { SugestionBase } from "@/core/interface/SugestionBase";
import { getProjectById } from "@/core/service/ProjetoService";
import { useEffect, useState } from "react";
import { Spinner } from "../LoadingSpin";
import CardProjeto from "./CardProjeto";

interface ProjetoLoaderProps {
    sugestion: SugestionBase;
}

export default function ProjetoLoader({ sugestion }: ProjetoLoaderProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try{
                const data = await getProjectById(sugestion.id);
                if(!mounted) return;
                setProject(data);
            } catch (e) {
                console.error("Erro ao carregar Projeto", e);
            } finally {
                if(mounted) setLoading(false);
            }
        }

        load();

        return () => { mounted = false; };
    }, [sugestion.id])

    if(loading) return <div className="h-[250px] w-[200px] border rounded flex text-primary items-center justify-center"><Spinner /></div>;

    if(!project) return <div>Nenhum pesquisador encontrado ou buscado</div>

    return <CardProjeto project={project} />
}