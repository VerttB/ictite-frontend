import { SimpleIdName } from "./Commom";
import { Image } from "./Image";
import { Researcher } from "./Pesquisador/Researcher";

export interface Project {
    id: string;
    name: string;
    description: string;
    clube: SimpleIdName;
    images?: Image[];
}

export interface ProjectResearchers {
    professores: Researcher[];
    alunos: Researcher[];
    facilitadores: Researcher[];
}
