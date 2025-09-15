import { Researcher } from "./Pesquisador/Researcher";

export interface Project{
    id: string,
    name: string,
    description: string,
    school: string
}

export interface ProjectResearchers{
    professores: Researcher[],
    alunos: Researcher[],
    facilitadores: Researcher[]
}