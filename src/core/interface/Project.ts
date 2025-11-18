import { Image } from "./Image";
import { Researcher } from "./Pesquisador/Researcher";

export interface Project{
    id: string,
    name: string,
    description: string,
    school: string
    images?: Image[];
}

export interface ProjectResearchers{
    professores: Researcher[],
    alunos: Researcher[],
    facilitadores: Researcher[]
}